import  jwt  from "jsonwebtoken"
import userModel from "../../../DB/model/User.model.js"
import Users from "../../../DB/model/User.model.js"
import bcrypt from 'bcrypt'
import CryptoJS from "crypto-js"
import { userRoles } from "../../../middleware/auth.middleware.js"
import { sendEmail } from "../../../utils/emailevent/sendEmail.js"
import { eventEmit } from "../../../utils/emailevent/sendEmailevent.js"
import { asyncHandler } from "../../../utils/err.handling/error.handling.js"
import { generateToken,verifyToken } from "../../../utils/token/token.js"
import {generateHash,decryptHash} from '../../../utils/hash/hash.js'
import {encryption,decryption} from '../../../utils/hash/encryption.js'
import crypto from 'crypto'

import sendEmailOTP from "../../../utils/emailevent/sendOTP.js"
import { eventOTP } from "../../../utils/emailevent/OTPevent.js"




// signupValidationSchema.validate({userName,email,password,phone},{abortEarly:false})





export const signup = asyncHandler(
    async (req, res, next) => {
        const {userName,email,password,confirmPassword,phone,role}=req.body

        
    
        if (password !== confirmPassword) {
            // return res.status(400).json({message:'password and confirmPassword are not the same'})
            return next(new Error('password and confirmPassword are not the same',{cause:400}))
        }
    
    
        const findUser = await userModel.findOne({email})

        if (findUser && !findUser.confirmEmail) {
            eventEmit.emit('sendEmail',{email})
            return res.status(200).json({message:'you received an another confirmation link again'})
        }


        if (findUser) {
            // return res.status(409).json({message:'email exists'})
            return next(new Error('email exists',{cause:409}))
        }
       
        const hashPass = generateHash({
            plainText:password,
            salt:parseInt(process.env.SALT)
        })

        const encPhone = encryption({
            PlainText:phone,
            signature:process.env.ENC
        })


        eventEmit.emit('sendEmail',{email})
        const create = await userModel.create({userName,email,password:hashPass,phone:encPhone,role})
    
        return res.status(201).json({message:'Done',create:create._id})
    
    
    
    
      
    }
)





export const activationLink = asyncHandler(
    async(req,res,next)=>{
        const {email} = req.body

        const user = await userModel.findOne({email})

        if (!user) {
            return next (new Error('invalid email',{cause:404}))
        }

        if (!user.isDeleted) {
            return next (new Error('your account is already active',{cause:404}))
        }


        eventEmit.emit('active',{email})
        return res.status(200).json({message:'check your email'})
    

    }
)

export const unFreezeAccount = asyncHandler(
    async(req,res,next)=>{
        const {authorization} = req.headers

        const {email} = verifyToken({
            token:authorization,
            signature:process.env.emailVer
        })

        const unfreeze = await userModel.findOneAndUpdate({email},{isDeleted:false})

        return res.status(200).json({message:'your account is now active'})

    }
)





export const login = asyncHandler(
    async(req,res,next)=>{
    
        const {email,password} = req.body

        const findUser = await userModel.findOne({email})

        if (!findUser) {
            // return res.status(404).json({message:"in-valid account or password"})
            return next(new Error('in-valid account or password',{cause:404}))
        }

        const matchPass = decryptHash({plainText:password,hashValue:findUser.password})
        if (!matchPass) {
            // return res.status(404).json({message:"in-valid account or password"})
            return next(new Error('in-valid account or password',{cause:404}))


        }


        if (!findUser.confirmEmail) {
            // return res.status(400).json({message:"confirm your account first"})
            return next(new Error('confirm your account first',{cause:400}))
        }
        const convert = findUser.toObject()
        delete convert.password

        // const tokenCreation = jwt.sign({id:findUser._id,isLogged:true},
        //     findUser.role== userRoles.user? process.env.TOKEN_SIGNATURE
        //     :process.env.TOKEN_SIGNATURE_ADMIN,{expiresIn:'1h'})


        if (findUser.isDeleted) {
            return next (new Error ('active your account first',{cause:403}))
        }
       
        findUser.changePassTime=0
        await findUser.save()


        const tokenCreation = generateToken({
            payload:{id:findUser._id,isLogged:true},
            signature: findUser.role== userRoles.user? process.env.TOKEN_SIGNATURE
            :process.env.TOKEN_SIGNATURE_ADMIN,
            options:{expiresIn:'1h'}
        })
        return res.status(200).json({message:"Done",tokenCreation})
        
   
}
)




export const confirmAccount = asyncHandler(
    async(req,res,next)=>{
    
        const {authorization} = req.headers

        if (!authorization) {
            // return res.status(400).json({message:'please provide a token'})
            return next(new Error('please provide a token',{cause:400}))
        }

        
        const {email} = verifyToken({
            token:authorization,
            signature:process.env.emailVer
            
        })
        
        

        const confirm = await userModel.findOneAndUpdate({email},{confirmEmail:true})

        return res.status(200).json({message:"Done",confirm})
        
    
}
)



export const sendOTP = asyncHandler(
    async(req,res,next)=>{
        const {email} = req.body
        const user = await userModel.findOne({email})
        if (!user) {
            return next(new Error('email does not exist',{cause:404})) 
        }


        const otp = crypto.randomInt(100000, 999999).toString();

        const otpExpiry = new Date(Date.now()+10*60*1000)

       

        eventOTP.emit('sendOTPPassword',{email,otp})
      
        await userModel.updateOne({email},{otp,otpExpiry})

        return res.status(200).json({message:'you received an code check your email'})

    }
)


export const RestPassword = asyncHandler(
    async(req,res,next)=>{
        const{email,otp,password}= req.body

        const user = await userModel.findOne({email})
        if (!user) {
          return next( new Error('email is not right',{cause:404}))  

        }
       
        
        if (user.otp !=otp) {
            return next(new Error('invalid otp',{cause:400})) 
        }

        if(new Date > user.otpExpiry){
            return next (new Error('otp is expired',{cause:400})) 
        }


        user.password = generateHash({
            plainText:password,
            salt:parseInt(process.env.SALT)
        })

        await user.save()

        return res.status(200).json({message:'password updated successfully'})

    }
)


