const fs = require('fs');
// in this section we will use superagent to make http request to get data
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`,(err , data)=>{
    console.log(`breed is : ${data}`);
     // ye url dogs.ceo se li hai ye different dogs ki pic degi
    // end laga k wahan res le rahay hn is url ka
     superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end(
        (err , res)=>{
            if (err) return console.log(err)
            // res.body likhaingay tou pura object ayega us nein se status aur message nikal saktay hn
            console.log(res.body.message);

            fs.writeFile('dog-image.txt' , res.body.message , err =>{
                if(err) return console.log(err.message);
                console.log('random dog image saved to file')

            })
        }
    )
})