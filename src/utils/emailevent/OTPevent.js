import { EventEmitter } from "node:events";
import sendEmailOTP from "./sendOTP.js";

export const eventOTP = new EventEmitter()


eventOTP.on('sendOTPEmail',async (data)=>{
    const {newEmail,emailOTP} = data

    console.log({newEmail,emailOTP});
    
    await sendEmailOTP({
        email:newEmail,
        otp:emailOTP
    })
})
eventOTP.on('sendOTPPassword',async (data)=>{
    const {email,otp} = data

    
    
    await sendEmailOTP({
        email:email,
        otp:otp
    })
})