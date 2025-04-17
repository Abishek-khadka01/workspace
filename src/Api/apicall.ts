import axios from "axios"


const UserRegister =async  (username : string, email: string , password : string)=>{
    return  await axios.post(import.meta.env.VITE_USERS_REGISTER,{
            username,
            email, 
            password
    }, 
{
    withCredentials : true
})
}


const UserLogin = async ( email : string , password : string)=>{
    return await axios.post(import.meta.env.VITE_USERS_LOGIN, {
        email ,
        password 
    }, {
        withCredentials: true
    })

}


const UserLogOut = async ()=>{
    return await axios.put( import.meta.env.VITE_USERS_LOGOUT, {}, {withCredentials: true})
}


const FindUser = async ()=>{
    return await axios.get(import.meta.env.VITE_USERS_DETAILS, {
        withCredentials : true
    })
}


const UpdateProfile = (filepath : File)=>{
    console.log(filepath)
    const newForm : FormData= new FormData()
    newForm.append("profile",filepath)
    return axios.post(import.meta.env.VITE_USERS_PROFILE, newForm, {
        headers:{
            "Content-Type":"multipart/form-data"
        },
        withCredentials: true
    })



}



export {UserRegister, UserLogin, UserLogOut, FindUser, UpdateProfile}