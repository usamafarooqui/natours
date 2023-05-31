// first import libary
const fs = require('fs');


// call the function to read the file
// it takes 2 parameters 1st is path
// second parameter is character encoding


const prfile = fs.readFileSync('./txt/input.txt','utf-8');

// print the txt 

console.log(prfile);

// to write a code in file 

const textout = `${prfile} tou mein kia krun nachun sale????`;

// it also takes 2 arguments file path aur jo cheez write krani hai wo
// agr file nahi hogi tou create krdega warna jo file hogi uska content update hojayega

fs.writeFileSync('./txt/output.text', textout);
