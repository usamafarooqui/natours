// import express
const express = require('express');
// express ki sari properties app mein de di hai 
const app = express();

// to create a basic app route 

app.get('/',(req, res)=>{
    // res.send('hello'); 
    // to also send the status code 
    res.status(200).send('hello world');

    // how to send json 
    res.json({message:'hekko' , age : 23});
});

app.post('/', (req, res)=>{
    res.send('you can post here')
})



// to create a basic server

const port = 8000;
app.listen(port , ()=>{
    console.log(`App is running on port ${port}...`)
})