import axios from "axios"


 export const UserRegisterApi = async ({username, email, password})=>{
    return  await axios.post(`${process.env.BACKEND_URL}/api/v1/register`, {
        username,
        email,
        password
    })
}


export const UserLoginApi = async (email, password)=>{
    return await axios.get(`${process.env.BACKEND_URL}/api/v1/login`, {
        email, 
        password
    })

}


export const UserLogOutApi = async ()=>{
    return await axios.post(`${process.env.BACKEND_URL}/api/v1/logout`)
}


export const AddDocumentApi = async (documentname, content)=>{
    return await axios.post(`${process.env.BACKEND_URL}/api/v1/documents/create-document `, {
        documentname,
        content
    })
}


