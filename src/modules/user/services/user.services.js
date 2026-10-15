import jwt from "jsonwebtoken"
import userModel from "../../../DB/model/User.model.js"
import CryptoJS from "crypto-js"
import { asyncHandler } from "../../../utils/err.handling/error.handling.js"
import {decryption, encryption} from '../../../utils/hash/encryption.js'
import { decryptHash, generateHash } from "../../../utils/hash/hash.js"
import { messageModel } from "../../../DB/model/message.model.js"
import crypto from 'crypto'
import { eventOTP } from "../../../utils/emailevent/OTPevent.js"
export const GetProfile = asyncHandler(
    async(req,res,next)=>{
    
        
        req.user.phone = decryption({
            cipher:req.user.phone,
            signature:process.env.ENC
        })

        const messages = await messageModel.find({recipientId:req.user._id}).populate([{
            path:'recipientId',
            select:'-password'
        }])

        return res.status(200).json({message:"Done",user:req.user,messages})

    

}
)


export const updateProfile = asyncHandler(
    async(req,res,next)=>{
        const {userName,phone,gender,DOB}=req.body

        if (phone) {
            req.body.phone = encryption({
                PlainText:req.body.phone
            })
        }

       const user = await userModel.findByIdAndUpdate(req.user._id,req.body,{new:true,runValidators:true})
        return res.status(200).json({message:'Done',user})
    }
)




export const updatePassword = asyncHandler(
    async(req,res,next)=>{
        const {oldPassword,password}=req.body
        if (!decryptHash({plainText:oldPassword,hashValue:req.user.password})) {
            return next (new Error ('invalid user password',{cause:400}))
        }

        const hashPass = generateHash({plainText:password})
    
       const user = await userModel.findByIdAndUpdate(req.user._id,{password:hashPass,changePassTime:Date.now()},{new:true})
        return res.status(200).json({message:'Done',user})
    }
)


export const freezeAccount = asyncHandler(
    async(req,res,next)=>{
       
    
       const user = await userModel.findByIdAndUpdate(req.user._id,{isDeleted:true,changePassTime:Date.now()},{new:true})
        return res.status(200).json({message:'Done',user})
    }
)


export const shareProfile = asyncHandler(
    async(req,res,next)=>{
        const user = await userModel.findById(req.params.userId).select('userName image')
        if(!user){
            return next (new Error ('invalid userId'))
        }
        return res.status(200).json({message:'Done',user})
    }
)



export const replaceEmail = asyncHandler(
    async (req,res,next)=>{
        const {userId,email,newEmail} = req.body

        const newUser = await userModel.findOne({email:newEmail})

        if (newUser) {
            console.log(newUser);
            return next(new Error('this email is used',{cause:404}))
            
        }

        const user = await userModel.findOne({_id:userId,email})

        if (!user) {
            return next(new Error('email is wrong please try again',{cause:404}))
        }

       

        const emailOTP = crypto.randomInt(100000, 999999).toString();
        const emailExpiry = new Date(Date.now()+10*60*1000)

        await userModel.updateOne({email},{emailOTP,emailExpiry,confirmEmail:false})

        eventOTP.emit('sendOTPEmail',{newEmail,emailOTP})

        return res.status(200).json({message:'check your new email'})
    }
)

export const resetNewEmail = asyncHandler(
    async(req,res,next)=>{
        const{email,newEmail,emailOTP,userId} = req.body

        const user = await userModel.findOne({_id:userId,email})
        if (!user) {
            return next (new Error('email is wrong please try again',{cause:404}))
        }

        const newUser = await userModel.findOne({email:newEmail})

        if (newUser) {
            return next (new Error('this email is used',{cause:409}))
        }

        if (user.emailOTP != emailOTP) {
            return next (new Error('invalid otp',{cause:400}))
        }

        if (new Date > user.emailExpiry) {
            return next (new Error('otp is expired',{cause:400})) 
        }

        const reset = await userModel.updateOne({email},{email:newEmail,confirmEmail:true,changePassTime:Date.now()})

        return res.status(200).json({message:'Done'})

    }
)






