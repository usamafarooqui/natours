// hum 1 boht bari file ko stream kraingay

const fs = require('fs');
const server = require('http').createServer();


server.on('request',(req, res)=>{
    // solution 1 ye solution jb tk file load nahi hogi hang rakhay ga aur agr ziada user 
    // huay aur resources khatm hogai node ki tou khatm app 

    // fs.readFile("test-file.txt",(err, data)=>{
    //     if(err) console.log(err)
    //     res.end(data);
    // })

    // solution 2 by streams
    // is approach mein bhi problem hai k jb jitni tezi se data araha ho utni tezi se hum 
    // data ka response nahi bhej pa rahay hon this issue is called back pressure


    // readable bus variable name hai kuch bhi dal saktay hn yahan


    // on se listen kr rahay hn event 
    // const readable = fs.createReadStream('testtt-file.txt')
    // chunk variable hai kuch bhi ho sakta 
    // data read stram ka khud ka evebt hai jo value store krta hai
    // readable.on('data' , chunk =>{
    //     res.write(chunk)
    // })

    // end bhi readable event ka khud ka event hai
    // readable.on('end', ()=>{
    //     res.end();
    // })

    

    // readable.on("error" , err =>{
    //     console.log(err);
    //     res.statusCode(500);
    //     res.end("file not found")
    // })




    // data aur end dono event sath mein denay lazmi hai



    // solution 3 by pipe
    // pipe speed of data coming in aur speed of data going out control krlega

    const readable = fs.createReadStream('testtt-file.txt');
    // readbale se source lega k kia read krana hai aur res mein speed k hisab se send krdega
    
    readable.pipe(res);


})




server.listen(8000 , ()=>{
    console.log('listening')
})