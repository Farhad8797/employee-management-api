const handleAuthorization = (req, res, next) => {
    try{
    const method = req.method;
    const userRole = req.user.userRole;
    if(userRole === 'admin') return next();
    if(userRole === 'editor'){
        if(method === 'DELETE') return res.status(403).json({message: `Err 1`});
        return next();
    }
    if(userRole === 'user'){
        if(method === 'GET') return next();
        return res.status(403).json({message: "Err 2"});
    }
}catch(err){
    res.status(500).json({message: `${err.message} ${JSON.stringify(req.user)}`});
}
};

module.exports = {handleAuthorization};