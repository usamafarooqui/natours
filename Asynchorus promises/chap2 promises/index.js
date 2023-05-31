const fs = require('fs');

const superagent = require('superagent');

// super agent khud promise support krta hai
// promise then catch se apply krtay


fs.readFile(`${__dirname}/dog.txt`,(err , data)=>{
    console.log(`breed is : ${data}`);
    
     superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).then(
        // result promise ka apna apna varaible hai to store results
        result =>{
            console.log(res.body.message);

            fs.writeFile('dog-image.txt' , res.body.message , err =>{
                if(err) return console.log(err.message);
                console.log('random dog image saved to file')

            })
        }
     ).catch(err =>{
        console.log(err.message)
     })
})