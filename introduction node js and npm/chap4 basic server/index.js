// requrie the server module 
const http = require('http');

// to create a server 

const server = http.createServer((req,res)=>{
    res.end('hello from server');
});


// to listen the server 
// it has 2 parameters port number and local host (optional hai local host dena)

server.listen(8000 , '127.0.0.1' , ()=>{
    console.log('server has been started on port 8000')
});