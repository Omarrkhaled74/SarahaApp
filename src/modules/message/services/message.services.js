import { messageModel } from "../../../DB/model/message.model.js"
import userModel from "../../../DB/model/User.model.js"
import { asyncHandler } from "../../../utils/err.handling/error.handling.js"



export const sendMessage =   asyncHandler(
    async (req,res,next)=>{
        const {message,recipientId} = req.body

        const user = await userModel.findOne({_id:recipientId,isDeleted:false})
        if (!user) {
            return next (new Error('invalid recipient',{cause:404}))
        }

        const newMessage = await messageModel.create({message,recipientId})
        return res.status(201).json({message:"Done"})
    }
)



export const DeleteMessage = asyncHandler(
    async(req,res,next)=>{
        const{messageId}=req.body

        const DeleteMessage= await messageModel.findByIdAndDelete({_id:messageId})
        if (!DeleteMessage) {
            return next(new Error(' message Id not found',{cause:404}))
        }

        return res.status(200).json({message:'Done'})
    }
)