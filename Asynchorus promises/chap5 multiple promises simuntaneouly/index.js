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



const getdogpic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`breed is : ${data}`);

    // await hata k sab k response store krengay

    const res1pro =  superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

     const res2pro =  superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

     const res3pro =  superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );


    const all = await Promise.all([res1pro , res2pro , res3pro]);
    const imgs = all.map(el => el.body.message)
    console.log(imgs);

    // file pe write krnay k lye 
    await writeFilePro("dog-image.txt", imgs.join('\n'));
    console.log("random dog image save to file");
   
  } catch (error) {
    console.log(error);

   

    throw error;
  }

  return ' i am ysaana';
};


(async ()=>{
  try {
    const x = await getdogpic();
    console.log(x)
  } catch (error) {
    console.log('error')
  }
})();