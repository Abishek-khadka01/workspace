import { Routes, Route } from "react-router-dom";
import DocumentEditorLandingPage from "./Components/LandingPage";
import LoginPage from "./Components/Login";
import RegisterPage from "./Components/Signup";
import DocumentList from "./Components/Documents";
import ErrorPage from "./Components/Errorpage";
import Wrapper from "./functions/Wrapper";
import Navbar from "./Components/Navbar";
import { Outlet } from "react-router-dom";
import NotePad from "./Components/Notepad"
import UserProfile from "./Components/Userpage";



// ✅ Layout Component to Show Navbar Globally
const Layout = () => {
  
  return (
     <>
      <Navbar />
      
      <Outlet /> {/* This renders the nested route */}
    </>
  );
};

const App = () => {
  return (
    <Routes>
      {/* ✅ Apply Layout only to routes that need a Navbar */}
      <Route element={<Layout />}>
        <Route path="/" element={<DocumentEditorLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/document/:id" element={<NotePad/>}></Route>
        <Route path="/user/:id" element={<UserProfile/>}></Route>
      </Route>

      {/* ✅ Dashboard Route (Wrapper must contain Outlet inside it) */}
      <Route path="/dashboard" element={<Wrapper />}>
        <Route index element={<DocumentList />} />

      </Route>

    
 
      
    </Routes>
  );
};

export default App;
