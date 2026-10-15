import mongoose from "mongoose";



export const connectionDB = async()=>{
    await mongoose.connect(process.env.DB).then(res=>{
        console.log('DB Connected');
        
    }).catch(err=>{
        console.log(`DB isn't Connected ${err}`);
        
    })
}