import nodemailer from 'nodemailer';

// إعداد nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',  // أو استخدم الخدمة المناسبة
    auth: {
        user: 'omarkhaled2372003@gmail.com',
        pass: 'kihxsmmstbmxxhwb',
    }
});

// دالة لإرسال الإيميل
const sendEmailOTP = async ({email, otp}={}) => {
    const mailOptions = {
        from: `saraha app 'omarkhaled2372003@gmail.com'` ,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending OTP');
    }
};

export default sendEmailOTP;
