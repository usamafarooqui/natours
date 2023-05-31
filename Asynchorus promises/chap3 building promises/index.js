const fs = require("fs");

const superagent = require("superagent");

// 1 esa promise bnatay hn jo file read kre but koi call back return na kre
// is function mein promise mein file read krengay

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("i could not find that file");
      resolve(data);
    });
  });
};

// write file function ka bhi 1 promise function bna letay hn

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write file");
      resolve("success");
    });
  });
};

// readfilepro function ko call krtay hn ab
// ye humari tarf se variable hai then ka jo result apne ander store krega

// agr koi function bnao aur wo promise return kre tou uske sath .then lagatay jao tou call back hell nahi bnega

readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`breed is : ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((result) => {
    console.log(result.body.message);

    return writeFilePro("dog-image.txt", result.body.message);
  }).then(()=>{
    console.log('random dog image save to file')
  })

  .catch((err) => {
    console.log(err.message);
  });
