module.exports= (err, req, res, next)=>{
    // to know status code 
    // agr status code aya tou theek warna 500 bhej dega
    err.statusCode = err.statusCode || 500;
    // to know status 
    err.status = err.status || 'error';
  
    res.status(err.statusCode).json({
      status:err.status,
      message:err.message
    })
    
  }