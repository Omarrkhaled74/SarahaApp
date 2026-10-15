import { Router } from "express";
import * as user from './services/user.services.js'
import { auth, authorization, userRoles } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { replaceEmail, resetNewEmail, shareProfile, updatePassword, updateValidation } from "./user.validation.js";
const router=Router()


router.get('/profile',auth(),authorization(Object.values(userRoles)),user.GetProfile)
router.patch('/updateProfile',validation(updateValidation),auth(),authorization(Object.values(userRoles)),user.updateProfile)
router.patch('/updatePassword',validation(updatePassword),auth(),authorization(Object.values(userRoles)),user.updatePassword)
router.delete('/freezeAccount',auth(),authorization(Object.values(userRoles)),user.freezeAccount)
router.get('/ShareProfile/:userId',validation(shareProfile),user.shareProfile)
router.patch('/replaceEmail',validation(replaceEmail),auth(),authorization(Object.values(userRoles)),user.replaceEmail)
router.patch('/resetNewEmail',validation(resetNewEmail),auth(),authorization(Object.values(userRoles)),user.resetNewEmail)

export default router