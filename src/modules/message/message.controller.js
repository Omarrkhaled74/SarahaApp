import { Router } from "express";
import * as message from './services/message.services.js'
import { validation } from "../../middleware/validation.middleware.js";
import { deleteMessage, sendMessage } from "./message.validation.js";
import { auth, authorization, userRoles } from "../../middleware/auth.middleware.js";
const router = Router()

router.post('/sendMessage',validation(sendMessage),message.sendMessage)
router.delete('/deleteMessage',validation(deleteMessage),auth(),authorization(Object.values(userRoles)),message.DeleteMessage)
export default router