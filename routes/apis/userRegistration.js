const {writeFile ,readFile} = require('fs').promises;
const path = require('path');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../../Schema/User.js');


router.post('/', async (req,res) => {
    try{
        const {username, password, user_role} = req.body;
        // Validation Code
        if(!username || !password){
            return res.status(400).json({message:"Please Enter your username and password"});
        }
        const user = await User.findOne({username_lookup: username.replace(/\s+/g, '').toLowerCase()}).exec();
        if(user){
            return res.status(409).json({message:"Can't register. User already exists"});
        }

        try{
            const newUser = await User.create({
                username,
                username_lookup: username.replace(/\s+/g,'').toLowerCase(),
                password: await bcrypt.hash(password, 10),
                user_role
            })
            return res.status(201).json({message:"Sccessfully created the user", newUser});
        }catch(fileErr){
            if(fileErr.code === 11000){
                return res.status(409).json({message:"Can't register. User already exists. (2nd err)"});
            }
            return res.status(500).json({message: fileErr.message});
        }
    }catch(err){
        return res.status(500).json({message: err.message});
    }
});

module.exports = router;