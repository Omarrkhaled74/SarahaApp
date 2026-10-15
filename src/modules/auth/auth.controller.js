
import { Router } from 'express'
// import { signup } from './service/registration.service.js';
import * as registrationService from './service/registration.service.js';
import { validation } from '../../middleware/validation.middleware.js';
import { signupValidationSchema,logInValidationSchema, OTP ,RestPassword, activationLink} from './auth.validation.js';
const router = Router();



router.post("/signup",validation(signupValidationSchema), registrationService.signup)
router.post("/login", validation(logInValidationSchema),registrationService.login)
router.patch("/confirmAccount", registrationService.confirmAccount)
router.post("/otp",validation(OTP), registrationService.sendOTP)
router.post("/restPass",validation(RestPassword), registrationService.RestPassword)
router.post('/activationLink',validation(activationLink),registrationService.activationLink)
router.patch('/unfreeze',registrationService.unFreezeAccount)

export default router