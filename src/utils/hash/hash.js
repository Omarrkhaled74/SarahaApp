import bcrypt from 'bcrypt'


export const generateHash = ({plainText='',salt=parseInt(process.env.SALT)}={})=>{
    const hash = bcrypt.hashSync(plainText,salt)
    return hash
}
export const decryptHash = ({plainText='',hashValue=''}={})=>{
    const match = bcrypt.compareSync(plainText,hashValue)
    return match
}