const http = require('http');
const fs = require('fs');

const url = require('url');



  // read the json data file

 // fs.readFile('./dev-data/data.json');
// use dirname because agr node command current directory k  ilawa chalaingay tou dot nahi get kr payega 
 // file q k dot ka mtlb hai current directory is liye use dirname 
const data =fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
 // data jo ayega wo json mein hoga is liye usko parse krengay
const dataObj = JSON.parse(data);

const server = http.createServer((req,res)=>{


    const pathName = req.url;

    if(pathName === '/overview' || pathName === '/'){
   
        res.end('hello from server');
    }
    else if(pathName === '/product'){
        res.end('hello from Product');
    }
    else if(pathName === '/api'){

            // send back the data but not as parse data but as a string for now q k 
            // res.end() sirf string wapis bhej sakta 

            // send back headers hum browser ko btaingay k hum json wapis bhejainga 
            // is se ye faida hoga hum bhejaingay string hi magr browser usko json consider krega
            res.writeHead(200 , {'content-type':'application/json'});

            res.end(data);
     

      

    }
    else{

        res.writeHead(404,{

            'Content-type':'text/html',
            'my-own':'hello world'

        });
        res.end('<h1>No page found</h1>')
    }


    console.log(req.url);
    
});

server.listen(8000, ()=>{
    console.log('lsitening to request on port 8000')
})
