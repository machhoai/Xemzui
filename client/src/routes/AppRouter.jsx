import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from '../pages/Login';
import SignupPage from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPass';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import { motion } from "motion/react";
import WelcomeLoad from '../components/WelcomeLoad';
import MovieDetail from '../pages/MovieDetail';

const AppRouter = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <Router>
            <motion.div
                initial={{ display: "block", zIndex: 1000000 }}
                animate={{ display: "none", zIndex: -1000000 }}
                transition={{
                    delay: 3,
                    duration: 0,
                    ease: "easeInOut",
                }} className="overflow-hidden absolute inset-0 w-screen h-screen"
            >
                <WelcomeLoad/>
            </motion.div>
            <Routes>
                
                <Route path="/" element={
                    <>
                        <Navbar isLoggedIn={isLoggedIn}/>
                        <Home />
                    </>
                    } 
                />
                <Route path="/Login" element={
                    <>
                        <Navbar isLoggedIn={isLoggedIn}/>
                        <LoginPage onLogin={() => setIsLoggedIn(true)}/>
                    </>
                    } 
                />
                <Route path="/SignUp" element={
                    <>
                        <Navbar isLoggedIn={isLoggedIn}/>
                        <SignupPage/>
                    </>
                    } 
                />
                <Route path="/ForgotPass" element={
                    <>
                        <Navbar isLoggedIn={isLoggedIn}/>
                        <ForgotPassword/>
                    </>
                    } 
                />
                <Route path="/movie/:id" element={
                    <>
                        <MovieDetail/>
                    </>
                    } 
                />
            </Routes>
        </Router>
    );
};


export default AppRouter;