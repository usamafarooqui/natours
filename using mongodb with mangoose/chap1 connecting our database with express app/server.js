const mongoose =require('mongoose'); // npm i mongoose
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const app = require('./app');

// CONNECT MONGODB
const DB = process.env.DATABASE;
mongoose.connect(DB,{
  useNewUrlParser:true,
  useUnifiedTopology: true,
  useCreateIndex:true,
  useFindAndModify:false
}).then((con)=> {
  // then mein con variable milta hai jis mein db ki properties hoti han
  // console.log(con.connections)
    console.log('conncection successful')
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});