import { EventEmitter } from "node:events";
import { sendEmail } from "./sendEmail.js";
import  jwt  from "jsonwebtoken";
import { generateToken } from "../token/token.js";

export const eventEmit = new EventEmitter()

eventEmit.on('sendEmail',async(data)=>{
    const {email} = data
    
    
    // const EmailToken = jwt.sign({email},process.env.EMAILVER)
    const EmailToken = generateToken({
        payload:{email},
        signature:process.env.EMAILVER,
        options:{expiresIn:'1h'}
    })
    const emailLink = `<a href='http://localhost:3000/${EmailToken}'>confirm your account</a>`
    await sendEmail({to:email,html:emailLink})
})



eventEmit.on('active',async(data)=>{
    const {email} = data
    
    
    // const EmailToken = jwt.sign({email},process.env.EMAILVER)
    const EmailToken = generateToken({
        payload:{email},
        signature:process.env.EMAILVER,
        options:{expiresIn:'1h'}

    })
    const emailLink = `<a href='http://localhost:3000/${EmailToken}'>confirm your account</a>`
    await sendEmail({to:email,html:emailLink})
})