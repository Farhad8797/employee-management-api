const express = require('express');
const path = require('path');
const router = express.Router();
let data = require(path.join(__dirname,'..','..','files','employees.json'));
const {verifyJWT} = require(path.join(__dirname, '..','..','middleware','verifyJWT.js'));
const {handleAuthorization} = require(path.join(__dirname, '..','..','middleware','userRoles.js'));
const Redis = require('redis');
require('dotenv').config();

let isRetrying = true;

const RedisClient = Redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: (attempt) => {
            if(attempt > 5){
                console.log('Maximum attempt reached');
                isRetrying = false;
                return false;
            }
            return 1000;
        }
    }
});

RedisClient.on('error',(err) => {
    if(isRetrying) console.log('Trying to connect...');
});

(async () => {
    try{
      await RedisClient.connect();  
    }catch(err){
        console.log(`Error! Check if Redis is running.`);
    }
})();

router.use(verifyJWT);
router.use(handleAuthorization);

router.get('/', async (req, res) => {
    const start = Date.now();
    console.log("Start Request");

    try {
        const info = await RedisClient.get('info');
        console.log(`Redis Get took: ${Date.now() - start}ms`);

        if (!info) {
            const parseStart = Date.now();
            await RedisClient.set('info', JSON.stringify(data), { EX: 1800 });
            console.log(`JSON Stringify & Set took: ${Date.now() - parseStart}ms`);
            return res.json({ message: 'Fresh Data', data });
        } 
        
        return res.json(JSON.parse(info));

    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.post('/',(req,res)=>{
    let newObj = {
        id: req.body.id,
        sku: req.body.sku,
        name : req.body.name,
        description: req.body.description,
        price: req.body.price,
        currency: req.body.currency
    };

    data.push(newObj);
    res.json(newObj);
});

router.put('/:id',(req,res) => {
    let id = parseInt(req.params.id);
    let objToBeUpdated = data.find(i => i.id === id);
    if(objToBeUpdated){
        objToBeUpdated.price = req.body.price;
        res.json({message: "successfully updated", objToBeUpdated});
    }else{
        res.status(404).json({message:"Not Found"});
    }
});

router.delete('/:id',(req,res) =>{
    let id = parseInt(req.params.id);
    let element = data.find(i => i.id === id);
    if(element){
        data = data.filter(i => i.id !== id);
        res.json({message:"Item deleted"});
    }
    else{
        res.json({message:"Item doesn't exist"});
    }
});

module.exports = router;