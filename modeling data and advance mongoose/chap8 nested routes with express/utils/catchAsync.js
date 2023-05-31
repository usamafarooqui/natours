// yahan 1 function bna letay hn jo sare try catch k liye chalay
module.exports = (fn) => {
    // 1 anomynous function k ander ye fn wali line likhni pregi warna ye khud call hota jayega
    return (req, res , next)=>{
      fn(req, res, next).catch(next);
  
    }
    // baki ki jaga yehi pe error handle krenagy
  };