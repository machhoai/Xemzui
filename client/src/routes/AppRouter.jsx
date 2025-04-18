import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from '../pages/Login';
import SignupPage from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPass';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import { motion } from "motion/react";
import WelcomeLoad from '../components/WelcomeLoad';

const AppRouter = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <Router>
            <motion.div
            initial={{ opacity: 1, height: "0px" }}
            whileInView={{ opacity: 1, height: "fit-content" }}
            transition={{
              delay: 3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            >
                <Navbar isLoggedIn={isLoggedIn} />
            </motion.div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Login" element={<LoginPage onLogin={() => setIsLoggedIn(true)}/>} />
                <Route path="/SignUp" element={<SignupPage/>} />
                <Route path="/ForgotPass" element={<ForgotPassword />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;