import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "../pages/Login";
import SignupPage from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPass";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import HomeAdmin from "../pages/admin/HomeAdmin"
import { motion } from "motion/react";
import WelcomeLoad from "../components/WelcomeLoad";
import MovieDetail from "../pages/MovieDetail";
import Footer from "../components/Footer";
import AdminRoute from "./adminRoutes";
import Sidebar from "../components/admin/Sidebar";
import MovieManagement from "../pages/admin/movies/MovieManagement";

const AppRouter = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Đồng bộ isLoggedIn khi app khởi động
  useEffect(() => {
    fetch("http://localhost:8000/api/user", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && !data.error) {
          setIsLoggedIn(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin user:", error);
        setLoading(false);
      });
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    fetch("http://localhost:8000/api/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.error("Lỗi khi đăng xuất:", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <motion.div
        initial={{ display: "block", zIndex: 1000000 }}
        animate={{ display: "none", zIndex: -1000000 }}
        transition={{
          delay: 3,
          duration: 0,
          ease: "easeInOut",
        }}
        className="overflow-hidden absolute inset-0 w-screen h-screen"
      >
        <WelcomeLoad />
      </motion.div>

      <Routes>
        {/* Route công khai */}
        <Route
          path="/"
          element={
            <>
              <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/Login"
          element={
            <>
              <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <LoginPage onLogin={() => setIsLoggedIn(true)} />
            </>
          }
        />
        <Route
          path="/SignUp"
          element={
            <>
              <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <SignupPage />
            </>
          }
        />
        <Route
          path="/ForgotPass"
          element={
            <>
              <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <ForgotPassword />
            </>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <>
              <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <MovieDetail />
              <Footer />
            </>
          }
        />

        {/* Route admin */}
        <Route element={<AdminRoute />}>
          <Route
            path="/admin"
            element={
                <>
                <HomeAdmin />
                </>
            }
          />
          <Route
            path="/admin/movies"
            element={
                <>
                <HomeAdmin />
                </>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
