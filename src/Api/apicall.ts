import axios from "axios"
import {LOGIN, LOGOUT, REGISTER} from "../constants/apiconstants.js"
const BACKEND_URL = `http://localhost:4000/api/v1`
console.log(BACKEND_URL)
const UserRegister =async  (username : string, email: string , password : string)=>{
    return  await axios.post(`${BACKEND_URL}/users/${REGISTER}`,{
            username,
            email, 
            password
    }, 
{
    withCredentials : true
})
}


const UserLogin = async ( email : string , password : string)=>{
    return await axios.post(`${BACKEND_URL}/users/${LOGIN}`, {
        email ,
        password 
    }, {
        withCredentials: true
    })

}


const UserLogOut = async ()=>{
    return await axios.put(`${BACKEND_URL}/users/${LOGOUT}`, {}, {withCredentials: true})
}


const FindUser = async ()=>{
    return await axios.get(`${BACKEND_URL}/users/profile-details`, {
        withCredentials : true
    })
}


const UpdateProfile = (filepath : File)=>{
    console.log(filepath)
    const newForm : FormData= new FormData()
    newForm.append("profile",filepath)
    return axios.post(`${BACKEND_URL}/users/add-profile`, newForm, {
        headers:{
            "Content-Type":"multipart/form-data"
        },
        withCredentials: true
    })



}



export {UserRegister, UserLogin, UserLogOut, FindUser, UpdateProfile}