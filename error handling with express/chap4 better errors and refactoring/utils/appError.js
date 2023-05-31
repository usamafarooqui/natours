// extends se express k built in error inherit kia hai
class AppError extends Error{
    constructor(message, statusCode){
        // super mein bus message ayega q k wo parent Error(express ka built in error) se inherit hota hai
        // when we extend a parent class we call super in order to call parent contructor

        super(message);
        this.statusCode = statusCode;
        // status ko uper constructor mein is liye nahi likha q k wo statuscode se ajayega
        // agr status code 4 se start hota hai tou fail warna error
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // we will create only operational errors in this class
        // is humari apni bnai hui property hai agr operational k ilawa koi error hoga tou usko false
        this.isOperational = true;

        // agr dekhna ho k error kahan aya hai aur kis file aur line mein aya hai
        Error.captureStackTrace(this,this.constructor);
    }
}


module.exports = AppError;