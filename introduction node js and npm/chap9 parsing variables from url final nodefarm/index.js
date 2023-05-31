const http = require('http');
const fs = require('fs');
const url = require('url');




const replaceTemplate =(temp , product)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g , product.productName);
     output = output.replace(/{%IMAGE%}/g , product.image);
     output = output.replace(/{%PRICE%}/g , product.price);
     output = output.replace(/{%FROM%}/g , product.from);
     output = output.replace(/{%NUTRIENTS%}/g , product.nutrients);
     output = output.replace(/{%QUANTITY%}/g , product.quantity);
     output = output.replace(/{%DESCRIPTION%}/g , product.description);
     output = output.replace(/{%ID%}/g , product.id);

     if (!product.organic)  output = output.replace(/{%NOT_ORGANIC%}/g , 'not-organic');
     return output;
     

     
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');



const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {

    // hum url se url ka variable parse kr saktay hn
    // console.log(req.url);
    // console.log(url.parse(req.url , true)); // ye url ko pura parse krdegi


    // ab hum 2 variables bnaye gay url.parse() ki property store krnay k liye 
    // hum normal variables bhi bna saktay hn but we will use es6 destructring 

    const {query , pathname} = url.parse(req.url, true);
    
    


    // overview
    if (pathname === '/overview' || pathname === '/') {
    
      
        res.writeHead(200, { 'content-type': 'text/html' });
        
        const cardHtml = dataObj.map(el => replaceTemplate(tempCard , el)).join('');

        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g ,cardHtml);
        res.end(output);
    }

    // product 
    else if (pathname === '/product') {

        res.writeHead(200, { 'content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct , product);
        res.end(output);
    }

    // api 
    else if (pathname === '/api') {

        res.writeHead(200, { 'content-type': 'application/json' });

        res.end(data);
    }


    // not found 
    else {

        res.writeHead(404, {

            'Content-type': 'text/html',
            'my-own': 'hello world'

        });
        res.end('<h1>No page found</h1>')
    }


    console.log(req.url);

});

server.listen(8000, () => {
    console.log('lsitening to request on port 8000')
})
