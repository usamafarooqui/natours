
// require dotenv modlule (npm i dotenv)
const dotenv = require('dotenv')
// to see in which environment we are in 
console.log(app.get('env'));
// to see all node env variables
console.log(process.env)

// define env file path
// 1 dafa ye file read hojaye phr ap isko kahin bhi use krsakatay ho
// eg process.env.USER
dotenv.config({path:'./config.env'})

const app = require('./app') // YE ENV K KAAM SE NEECHAY AYEGA
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});