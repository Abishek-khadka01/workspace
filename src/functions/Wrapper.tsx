import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import useAuthStore from "./zustand";
import Navbar from "../Components/Navbar";

// Checks if the login has been made or not 
function Wrapper() {
    const { isLogin } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin) {
            navigate("/"); // Redirect to home if not logged in
        }
    }, [isLogin, navigate]);

    // If the user is logged in, render the Outlet
    return isLogin ? <>
        <Navbar/>
        <Outlet/>
    </> : null;
}

export default Wrapper;