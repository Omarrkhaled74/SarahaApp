import nodemailer from 'nodemailer'

    // async..await is not allowed in global scope, must use a wrapper
    export const sendEmail = async({to=[],cc=[],bcc='',subject='confirm-email',text='',html='',attachments=[]}={})=> {
      // send mail with defined transport object
      
const transporter = nodemailer.createTransport({
    service:'gmail',
      auth: {
        user: 'omarkhaled2372003@gmail.com',
        pass: 'kihxsmmstbmxxhwb',
      },
    });
      const info = await transporter.sendMail({
        from: `"sarahaApp 👻" <'omarkhaled2372003@gmail.com'>`, // sender address
        to , // list of receivers
        cc,
        bcc,
        subject , // Subject line
        text , // plain text body
        html, // html body
        attachments
      });
    
    return info
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }