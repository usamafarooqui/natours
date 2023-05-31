const http = require('http');
const fs = require('fs');

const url = require('url');
const { CLIENT_RENEG_LIMIT } = require('tls');


// lets make replace template function

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


// lets load the templates 
// load krnay ki files server ki request ki bajaye uper krni chaiye nahi tou hr bar request pe server ko file load
// krni pregi 

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');


// api ka data yahan load kraya hai
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

// dataObj mein sari api ka data(object) array mein majood hai
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {


    const pathName = req.url;


    // overview
    if (pathName === '/overview' || pathName === '/') {
    
        // server ko btao status code aur k hum html bhej rahay hn
        res.writeHead(200, { 'content-type': 'text/html' });
        
        // data ko dataobj se dispalay kranay k liye uske uper loop chalaingay takay uske content display kr saken
        // el variable name hai iske ander dataObj ka data hoga
        const cardHtml = dataObj.map(el => replaceTemplate(tempCard , el)).join('');

        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g ,cardHtml);

        // console.log(output);

        // send html template
        res.end(output);
    }

    // product 
    else if (pathName === '/product') {
        res.end('hello from Product');
    }

    // api 
    else if (pathName === '/api') {

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
