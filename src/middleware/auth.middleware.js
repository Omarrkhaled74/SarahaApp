import  jwt  from "jsonwebtoken"
import userModel from "../DB/model/User.model.js"
import { asyncHandler } from "../utils/err.handling/error.handling.js"
import {verifyToken} from '../utils/token/token.js'


export const userRoles = {
    user:'user',
    admin:'admin'
}
export const auth= ()=>{
    return asyncHandler(
        async  (req,res,next) =>{
        
            const {authorization} = req.headers
            if (!authorization) {
                // return res.status(400).json({message:''})
                return next(new Error('authorization is required',{cause:400}))
            }
            const [Bearer,token] = authorization.split(' ')
            let signature = undefined
            if (!Bearer || !token) {
                // return res.status(400).json({message:'authorization is required'})
                return next(new Error('authorization is required',{cause:400}))
            }
            switch (Bearer) {
                case 'user':
                    signature =process.env.TOKEN_SIGNATURE
                    break;
                case 'admin':
                    signature =process.env.TOKEN_SIGNATURE_ADMIN
                    break;
                default:
                    break;
            }
            const decoded = verifyToken(
                {
                    token:token,
                    signature:signature
                }
            )
            if (!decoded?.id) {
                // return res.status(400).json({message:'in-valid token payload'})
                return next(new Error('in-valid token payload',{cause:400}))
            }
            const user = await userModel.findById(decoded.id)
            if (!user) {
                // return res.status(404).json({message:'not register account'})

                return next(new Error('not register account',{cause:404}))
            }
            
            if (parseInt(user.changePassTime?.getTime() ||0 / 1000)>= decoded.iat) {
                return next (new Error('Expired credential',{cause:400}))
            }
            req.user = user
            return next()
    }
    )
}
export const authorization= (accessRoles=[])=>{
    return asyncHandler(
        async  (req,res,next) =>{
            if (!accessRoles.includes(req.user.role)) {
                // return res.status(403).json({message:'not auth account'})
                return next(new Error('not auth account',{cause:403}))
            }
            return next()
    }
    )
}