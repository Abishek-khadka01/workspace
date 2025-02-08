import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
dotenv.config();

export type typeUser = {
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
};

type UserType = {
    username?: string;
    email: string;
    password: string;
};

type UserFn = (user: Required<UserType>) => Promise<AxiosResponse<ResponseTypeforUser>>;

type LoginFn = (email: string, password: string) => Promise<AxiosResponse<ResponseTypeforUser>>;

type AddDocumentFn = (documentName: string, content: string) => Promise<AxiosResponse>;

export const UserRegisterApi: UserFn = async ({ username, email, password }) => {
    return await axios.post(`${process.env.BACKEND_URL}/api/v1/register`, {
        username,
        email,
        password
    });
};

export const UserLoginApi: LoginFn = async (email, password) => {
    return await axios.post(`${process.env.BACKEND_URL}/api/v1/login`, {
        email,
        password
    });
};

export const UserLogOutApi = async (): Promise<AxiosResponse> => {
    return await axios.post(`${process.env.BACKEND_URL}/api/v1/logout`);
};

export const AddDocumentApi: AddDocumentFn = async (documentName, content) => {
    return await axios.post(`${process.env.BACKEND_URL}/api/v1/documents/create-document`, {
        documentName,
        content
    });
};
