import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const sendMessage = joi.object().keys({
    message:joi.string().pattern(new RegExp(/^[a-zA-Z\u0621-\u064Aء-ئ][^#&<>\"~;$^%{}?]{2,1000}$/)).required(),
    recipientId:generalFields.userId.required()
}).required()


export const deleteMessage = joi.object().keys({
    messageId:generalFields.messageId.required()
}).required()