const {readFile, writeFile, rename, unlink, appendFile} = require('fs').promises;
const path = require('path');

let fileOps = async () => {
    try{
    let data = await readFile(path.join(__dirname, 'files', 'text1.txt'), 'utf-8');
    console.log(data);
    await writeFile(path.join(__dirname, 'files', 'text3.txt'),'Hello Wrold!');
    await appendFile(path.join(__dirname, 'files', 'text3.txt'),"\nI'm Farhad who's trying to learn NodeJs");
    await rename(path.join(__dirname, 'files', 'text3.txt'),path.join(__dirname, 'files', 'test.txt'));
    let newData = await readFile(path.join(__dirname, 'files', 'test.txt'), 'utf-8');
    console.log(newData);
    }catch(err){
        console.log(err);
    }
};

let deleteFile = async () => {
    let msg = await unlink(path.join(__dirname, 'files', 'test.txt'),'File deleted');
    console.log(msg);
};

deleteFile();
// fileOps();