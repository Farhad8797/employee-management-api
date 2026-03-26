const {readFile, writeFile} = require('fs').promises;
const path = require('path');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../Schema/User.js');

require('dotenv').config();


router.post('/', async (req,res) => {
    try{
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({message: "Provide the credentials"});
        }
        const user = await User.findOne({username_lookup: username.replace(/\s+/g, '').toLowerCase()}).select('+password').exec();
        if(!user){
            return res.status(401).json({message: "This user isn't registered"});
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if(!comparePassword){
            return res.status(403).json({message: "Wrong credential"});
        }
        const accessToken = jwt.sign(
            {userInfo:{
                username: user.username,
                userRole: user.user_role
            }},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60s' }
        );

        const refreshToken = jwt.sign(
            {username: user.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('jwt', refreshToken, {maxAge: 86400000, httpOnly: true});
        return res.status(201).json({message:`${username} logged in!`, accessToken});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;