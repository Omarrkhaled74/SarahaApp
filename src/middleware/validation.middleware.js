import joi from "joi"
import { Types } from "mongoose"

export const validationObjectId = (value,helper)=>{
    return Types.ObjectId.isValid(value)? true : helper.message('invalid objectId')
}

export const generalFields = {
        userName:joi.string().min(3).max(25),
        password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).messages({
            "string.pattern.base":'enter a strong Password'}),
        confirmPassword:joi.string().valid(joi.ref('password')),
        userId:joi.string().custom(validationObjectId),
        messageId:joi.string().custom(validationObjectId),
        email:joi.string().email({minDomainSegments:2,maxDomainSegments:2,tlds:{allow:['com','net']}}) ,
        phone:joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)).messages({'string.pattern.base':'only egyptian numbers are allowed' }),     
}

export const validation = (schema)=>{
    return(req,res,next)=>{
        const inputData = {...req.body,...req.query,...req.params}
        if (req.headers['accept-language']) {
            inputData['accept-language']=req.headers['accept-language']
        }
        const validationError = schema.validate(inputData,{abortEarly:false})
        if (validationError.error) {
            return res.status(400).json({message:'validation Result',validationError:validationError.error.details})
        }
        return next()
    }
}