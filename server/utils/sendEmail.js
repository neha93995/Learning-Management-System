import nodemailer from 'nodemailer';

// async await is no allowed in global scope , must use a wrapper

const sendEmail =  async function(email, subject, message){
    
    // create resuable transporter object using the default SMTP transport 
    
    let transporter  = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false,
        auth:{
            user:process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        }
    });
    
    //send mail with defined transport object 
    
    await transporter.sendMail({
        from:process.env.SMTP_FROM_EMAIL, //sender address
        to:email, // user email
        subject:subject, // subject line
        html:message, // html body
    });
    
    console.log("-----------------------")

}

export default sendEmail;