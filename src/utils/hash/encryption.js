import CryptoJS from "crypto-js";

export const encryption = ({PlainText='',signature=process.env.ENC})=>{
    const encrypt = CryptoJS.AES.encrypt(PlainText,signature).toString()
    return encrypt
}



export const decryption = ({cipher='',signature=process.env.ENC})=>{
    const decrypt = CryptoJS.AES.decrypt(cipher,signature).toString(CryptoJS.enc.Utf8)
    return decrypt
}
