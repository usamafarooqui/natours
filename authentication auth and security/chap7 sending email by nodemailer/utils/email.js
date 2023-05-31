// install nodemailer npm i nodemailer

const nodemailer = require('nodemailer');

const sendEmail = async options =>{
    // 1) create a transporter 
    // for gmail
    // const transporter = nodemailer.createTransport({
    //     service:'Gmail',
    //     auth:{
    //         user: process.env.EMAIL_USERNAME,
    //         pass:process.env.EMAIL_PASSWORD
    //     }
    //     // ACTIVATE IN GMAIL "LESS SECURE APP" OPTION
    // });
    
    // trasporter is a service that will actually send the email
    // we will use mailtrap sign up there
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
        
    });

    // 2) define some options for the email 
    const mailOptions ={
        from:'Usama Farooqui <muhammadusamafarooqui@gmail.com',
        // options ye humara function ka parameter hai
        to:options.email,
        subject:options.subject,
        text:options.message
    };


    // 3) actually send the email 
    await transporter.sendMail(mailOptions);
}


module.exports = sendEmail;