import axios, { AxiosResponse } from "axios";

axios.defaults.withCredentials= true
 export const BACKEND_URL =`http://localhost:3000`
export type typeUser = {
    _id: string,
    username: string;
    profilepicture: string;
    password: string;
    email: string;
    updated_at: Date;
    refreshToken?: string;
};

export type ResponseTypeforUser = {
    success: boolean;
    message: string | typeUser;
    user : typeUser
};

type UserType = {
    username?: string;
    email: string;
    password: string;
};

type UserFn = (user: Required<UserType>) => Promise<AxiosResponse<ResponseTypeforUser>>;

type LoginFn = (email: string, password: string) => Promise<AxiosResponse<ResponseTypeforUser>>;


type ResponseTypeforDocument = {
    _id : string,
    name : string
    owner : string,
    content : string,
    members:string[],

}

type AddDocumentFn = (documentName: string, content: string) => Promise<AxiosResponse<ResponseTypeforDocument>>;

export const UserRegisterApi: UserFn = async ({ username, email, password }) => {
    return await axios.post(`${BACKEND_URL}/api/v1/users/register`, {
        username,
        email,
        password
    }, );
};

export const UserLoginApi: LoginFn = async (email, password) => {
    return await axios.post(`${BACKEND_URL}/api/v1/users/login`, {
        email,
        password
    });
};

export const UserLogOutApi = async (): Promise<AxiosResponse> => {
    return await axios.post(`${BACKEND_URL}/api/v1/users/logout`, );
};

export const AddDocumentApi: AddDocumentFn = async (documentName, content) => {
    return await axios.post(`${BACKEND_URL}/api/v1/documents/create-document`, {
        documentName,
        content
    });
};
