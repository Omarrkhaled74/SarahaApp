import joi from "joi"
import { generalFields } from "../../middleware/validation.middleware.js"
export const signupValidationSchema = joi.object().keys(
    {
        userName:generalFields.userName.required(),
        password:generalFields.password.required(),
        confirmPassword:generalFields.confirmPassword.required(),
        phone:generalFields.phone.required(),
        'accept-language':joi.string().valid('en','ar').default('en').required(),
        email:generalFields.email.required()
    }).options({allowUnknown:false})








export const logInValidationSchema = joi.object().keys(
    {
        
        password:generalFields.password.required(),
        'accept-language':joi.string().valid('en','ar').default('en').required(),
        email:generalFields.email.required()
    }).options({allowUnknown:false})


export const OTP = joi.object().keys(
    {
        
        
         
        email:generalFields.email.required()
    }).options({allowUnknown:false})


export const RestPassword = joi.object().keys(
    {
        
        otp:joi.string().length(6).required(),
       
        password:generalFields.password.required(),
         
        email:generalFields.email.required()
    }).options({allowUnknown:false})



export const activationLink = joi.object().keys({
    email:generalFields.email.required()
}).required()    