const { mkdir, rmdir, existsSync } = require('fs');

if(!existsSync('./new')){
    mkdir('./new',(err) => {
        if (err) throw err;
        console.log("Directory created");
    });
}else{
    rmdir('./new',(err) => {
        if (err) throw err;
        console.log('Directory deleted');
    });
}