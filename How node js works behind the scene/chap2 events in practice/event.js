// require events 

const eventEmitter = require('events');





class Sales extends eventEmitter{
    // jab koi object create krengay constructor run hoga
    constructor(){
        super();
    }
}

// uska instance bnao
const myEmitter = new Sales();

// ye event ko listen kr raha hai
// on yani event listen  kr raha hai k jb event fire ho tou event chalaye
// newSale us event ka naam hai jo fire hoga hum 1 hi event k mulltiple on event listeners bna saktay hn
myEmitter.on("newSale" , ()=>{
    console.log('there was a new sale');
});

// newSale ka 2 event 

myEmitter.on("newSale" , ()=>{
    console.log('Consumer name : Usma a');
})


// yahan humnne event fire krdia

myEmitter.emit("newSale");


// ager hum chahain tou koi value bhi emitter se event listener ko bhej saktay hn 

myEmitter.on("newSale" , (usama)=>{
    console.log(`dekho usama name yahan aya ${usama}`);
})



myEmitter.emit("newSale" , 8);



/////////////////////--------------------------------------------------///////////////////////////////////
// example 2 
// event se server bna aur listen krna


const http = require('http');

const server = http.createServer();

// request create server ka built in event hai
server.on('request',(req, res)=>{
    console.log('request reived');
    res.end('Request recieve')
});

server.on('request',(req, res)=>{
    console.log('request reived');
    console.log(' Another Request recieve')
});


server.on('close',(req, res)=>{
    console.log('server close');
   
});


server.listen(8000 , ()=>{
    console.log('waiting for request')
})