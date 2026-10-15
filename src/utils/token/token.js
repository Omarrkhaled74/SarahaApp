import  jwt  from "jsonwebtoken"


export const generateToken = ({payload={},signature=TOKEN_SIGNATURE,options={}}={})=>{
   const token = jwt.sign(payload,signature,options) 
   return token
}


export const verifyToken = ({token='',signature=TOKEN_SIGNATURE}={})=>{
   const decodedToken = jwt.verify(token,signature) 
   return decodedToken
}