const nodemailer=require('nodemailer')
require('dotenv').config()
exports.mailSender=async(email,title,body)=>{
    try{
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            port:process.env.SMTP_PORT,
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        })
        // who is sending email to whom
        // from to subject html 
        let info=await transporter.sendMail({
            from:`${process.env.EMAIL_USER}`,
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`

        })
        console.log(info);
        return info
    }
    catch(error){
        console.log(error);
        throw error;
    }

}