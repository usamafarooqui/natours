// now we see asynchorous functions 
const fs = require('fs');


// non blocking code 
// it takes 2 aruguments path , enocoding and a call back
// call back mein pehli value error hogi jo error through kregi dusri data naam change hosakta hai
// call back k ander call back is call back hell jb trinage anay lagay left


fs.readFile('./txt/start.txt' , 'utf-8' , (err , data1)=>{
    console.log("1");
    console.log(data1);
    fs.readFile(`./txt/${data1}.txt` , 'utf-8' , (err , data2)=>{
        console.log("2")
        console.log(data2);
        fs.readFile('./txt/append.txt' , 'utf-8' , (err , data3)=>{
            console.log("3")
            console.log(data3);
            fs.writeFile('./txt/final.txt' , 'utf-8' , err =>{
                    console.log("file has been written 4");
            });
        });
    }); 
});


console.log("kon pehlay ayega")