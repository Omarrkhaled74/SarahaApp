import joi from "joi";
import { generalFields, validationObjectId } from "../../middleware/validation.middleware.js";


export const updateValidation = joi.object().keys({
    userName:generalFields.userName,
    phone:generalFields.phone,
    DOB:joi.date().less('now'),
    gender:joi.string().valid('male','female')
}).required()



export const updatePassword = joi.object().keys({
    oldPassword:generalFields.password.required(),
    password:generalFields.password.not(joi.ref('oldPassword')).required(),
    confirmPassword:generalFields.confirmPassword.valid(joi.ref('password')).required()
}).required()
export const shareProfile = joi.object().keys({
   userId:generalFields.userId.required()
}).required()


export const replaceEmail = joi.object().keys({
    email:generalFields.email.required(),
    userId:generalFields.userId.required(),
    newEmail:generalFields.email.required()
}).required()

export const resetNewEmail= joi.object().keys({
    email:generalFields.email.required(),
    newEmail:generalFields.email.required(),
    userId:generalFields.userId.required(),
    emailOTP:joi.number().positive().integer()
}).required()