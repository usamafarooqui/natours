const fs = require("fs");

const superagent = require("superagent");

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("i could not find that file");
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write file");
      resolve("success");
    });
  });
};

// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`breed is : ${data}`);

//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((result) => {
//     console.log(result.body.message);

//     return writeFilePro("dog-image.txt", result.body.message);
//   }).then(()=>{
//     console.log('random dog image save to file')
//   })

//   .catch((err) => {
//     console.log(err.message);
//   });

// async await function
// is mein error handle k liye try cathch

const getdogpic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`breed is : ${data}`);

    const result = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(result.body.message);

    await writeFilePro("dog-image.txt", result.body.message);
    console.log("random dog image save to file");
   
  } catch (error) {
    console.log(error);

    // jb hum async mein kuch return krengay tou wo phr error throw nahi kr payega
    // usko liye use throw

    throw error;
  }

  return ' i am ysaana';
};

getdogpic();


// agr function se koi value return krani ho aur usko ruk k rakhna ho tou


// getdogpic().then(x =>{
//   console.log(x)
// }).catch(err => {
//   console.log('error')
// })

// to do this by async await rather then and catch 

// async ka function bnao aur usko foran call krdi 
// (async ()=>{})();

(async ()=>{
  try {
    const x = await getdogpic();
    console.log(x)
  } catch (error) {
    console.log('error')
  }
})();