const http = require('http');


// routing k lye import 
const url = require('url');

// make the server 

const server = http.createServer((req,res)=>{
    // to implement routing

    const pathName = req.url;

    if(pathName === '/overview' || pathName === '/'){
        // res.end is use to send a simple response
        res.end('hello from server');
    }
    else if(pathName === '/product'){
        res.end('hello from Product');
    }else{
        // we can also send headers 
        // it is a peice of infomation that we want to send with our response 
        // ye console mein ayega
        // 404 http error hota hai
        // header humesha response se pehlay set hoga
        res.writeHead(404,{

            'Content-type':'text/html',
            // khud ka header bhi bna saktay hn
            'my-own':'hello world'

        });
        res.end('<h1>No page found</h1>')
    }


    console.log(req.url);
    
});

server.listen(8000, ()=>{
    console.log('lsitening to request on port 8000')
})
