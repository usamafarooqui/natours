const mongoose =require('mongoose');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
// to read the json file
const fs =require('fs');
const Tour = require('../../model/tourModel')

// CONNECT MONGODB
const DB = process.env.DATABASE;
mongoose.connect(DB,{
  useNewUrlParser:true,
  useUnifiedTopology: true,
  useCreateIndex:true,
  useFindAndModify:false
}).then(()=> {
    console.log('conncection successful')
});

// to read the json file
// JSON.parse() converts json into js object
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));

// import data into db

const importData= async ()=>{
    try {
        await Tour.create(tours);
        console.log('data successfully loaded')
    } catch (error) {
        console.log(error)
    }
    process.exit();
}


// delete all data from the database

const deleteData= async ()=>{
    try {
        await Tour.deleteMany();
        console.log('data successfully deleted');
    } catch (error) {
        console.log(error)
    }
    process.exit();
}


// ye walay command run krlena
// node dev-data/data/import-dev-data.js --delete
// node dev-data/data/import-dev-data.js --import

if(process.argv[2]==='--import'){
    importData();
}else if(process.argv[2]==='--delete'){
    deleteData();
}

