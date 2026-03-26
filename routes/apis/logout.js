const path = require('path');
const {readFile, writeFile} = require('fs').promises;
const router = require('express').Router();

router.get('/', async (req, res) => {
    try{
        const refreshToken = req.cookies?.jwt;
        if(!refreshToken) return res.sendStatus(204);
        const data = await readFile(path.join(__dirname, '../../files/userInfo.json'), 'utf-8');
        const users = JSON.parse(data);
        const currUser = users.find(i => i.refreshToken === refreshToken);
        if(!currUser){
            res.clearCookie('jwt',{maxAge: 86400000, httpOnly: true});
            return res.sendStatus(204);
        }
        const otherUsers = users.filter(i => i.refreshToken !== refreshToken);
        const {refreshToken: unused, ...rest} = currUser;
        const updateUsers = [...otherUsers, rest];
        await writeFile(path.join(__dirname, '../../files/userInfo.json'), JSON.stringify(updateUsers, null, 2));
        res.clearCookie('jwt',{maxAge: 86400000, httpOnly: true});
        res.sendStatus(204);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;