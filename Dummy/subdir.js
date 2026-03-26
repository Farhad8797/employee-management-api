const express = require('express');
const path = require('path');
const router = express.Router();

router.get(['/index','/index.html'],(req,res) => {
    res.sendFile(path.join(__dirname,'..','files','subdir','index.html'));
});

router.get('/*splat',(req,res) => {
  res.status(404).sendFile(path.join(__dirname,'..','files','subdir','404.html'))
});

module.exports = router;