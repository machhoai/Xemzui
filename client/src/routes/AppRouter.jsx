import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from '../pages/Login';
import SignupPage from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPass';
import Navbar from '../components/Navbar';

const AppRouter = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} />
            <Routes>
                <Route path="/Login" element={<LoginPage onLogin={() => setIsLoggedIn(true)}/>} />
                <Route path="/SignUp" element={<SignupPage/>} />
                <Route path="/ForgotPass" element={<ForgotPassword />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;