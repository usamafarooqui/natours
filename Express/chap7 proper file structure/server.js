// server ki file bhi alag bna do

// import app

const app = require('./app')

// isko ab app ka nahi pta tou app ko export kro
const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});