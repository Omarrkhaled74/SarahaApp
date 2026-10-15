export const asyncHandler = (fn)=>{
    return (req,res,next)=>{
    return  fn(req,res,next).catch(error=>{
            // return res.status(500).json({error:error.message})
            return next(new Error(error,{cause:500}))
        })
    }
}


export const GlobalErr = (error,req,res,next)=>{
    return res.status(error.cause||500).json({message:error.message})
}