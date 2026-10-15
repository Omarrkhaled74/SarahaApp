import mongoose, { model, Schema } from "mongoose"

import {userRoles} from '../../middleware/auth.middleware.js'

const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        minlength:2,
        maxlength:50,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String
    },
    gender:{
        type:String,
        enum:['male','female'],
        default:'male'
    },
    image:{
        type:String
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:Object.values(userRoles),
        default:'user'
    },
    DOB:Date,
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
    emailOTP:{
        type:String
    },
    emailExpiry:{
        type: Date,
    },
    changePassTime:{
        type:Date
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})


const userModel = mongoose.models.User || model('User',userSchema)

export default userModel