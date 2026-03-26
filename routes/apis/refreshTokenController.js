const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = require('express').Router();
const User = require('../../Schema/User.js');

router.get('/', async (req,res) => {
    try{
        const refreshToken = req.cookies?.jwt;
        const currUser = await User.findOne({refreshToken:refreshToken}).select('+refreshToken').exec();
        if(!refreshToken) return res.status(403).json({message:"Error"});
        if(!currUser) return res.status(403).json({message: `Error 2:`});
        const decodedInfo = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if(decodedInfo.username !== currUser.username) return res.status(403).json({message: `Error 3: ${JSON.stringify(currUser)}`});
        const accessToken = jwt.sign(
            {userInfo:{
                username: currUser.username,
                userRole: currUser.user_role
            }},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'60s'}
        );
        return res.json({accessToken});
    }catch(err){
        return res.status(403).json({message: err.message});
}
});

module.exports = router;