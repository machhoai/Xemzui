import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "../pages/Login";
import SignupPage from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPass";
import Navbar from "../components/Navbar";
import { refreshAccessToken } from "../services/RefreshAccessTokenAPI";
import Home from "../pages/Home";
import DashboardMovieAdmin from "../pages/admin/movies/DashboardMovieAdmin";
import { motion } from "motion/react";
import WelcomeLoad from "../components/WelcomeLoad";
import MovieDetail from "../pages/MovieDetail";
import Footer from "../components/Footer";
import ProfilePage from "../pages/ProfilePage";
import ResetPasswordPage from "../pages/ResetPassword";
 import SearchPage from "../pages/SearchPage";
 import MovieCreate from "../components/admin/movies/MovieCreate";
import {OrbitProgress} from "react-loading-indicators";
import { useLoading } from "../contexts/LoadingContext";
import Sidebar from "../components/admin/layout/Sidebar";
import DashboardAdmin from "../pages/admin/movies/DashboardAdmin";

const AppRouter = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const { isLoading, setLoading } = useLoading();
  const [isCheckingUser, setisCheckingUser] = useState(true); // trạng thái loading

  //kiểm tra phiên đăng nhập
  useEffect(() => {
    const checkLoginStatus = async () => {
      fetch("http://localhost:8000/api/user", {
        method: "GET",
        credentials: "include",
      })
        .then(async(response) => {
          if (response.status === 401) { //access token hết hạn
            console.log("checkLoginStatus: lỗi 401 tôi đang ở đây yêu cầu đăng nhập lại");
            await refreshAccessToken(() => { checkLoginStatus() }, setIsLoggedIn);
            return;
          }
          else if (!response.ok) {
            const message = await response.json();
            window.alert(message.message);
            return;
          }
          return response.json();
        })
        .then((data) => {
          if (!data) {
            setisCheckingUser(false);
            return;
          }
          setIsLoggedIn(true);
          if (data.isAdmin) {
            console.log("isAdmin:", data.isAdmin);
            setIsAdmin(true);
          }
          setisCheckingUser(false);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin user:", error);
        });
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    console.log("isLoading đã đổi:", isLoading);
  }, [isLoading]);

  if(isCheckingUser) {
    return (
      <motion.div
        initial={{opacity: 1, display: "block", zIndex: 1000000 }}
        animate={isLoading?{opacity:0, display: "none", zIndex: 1000000 }:{opacity: 1, display: "block", zIndex: 1000000 }}
        transition={{
          delay: 2,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="fixed overflow-hidden inset-0 w-screen h-screen"
      >
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity:1}}
          transition={{
            delay: 4,
            duration: 0.5,
            ease: "easeInOut",
          }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-20 z-1000000 "
        >
          <OrbitProgress color="#8391a7" size="small" text="" textColor=""/>
        </motion.div>
        <WelcomeLoad />
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{opacity: 1, display: "block", zIndex: 1000000 }}
        animate={!isLoading?{opacity:0, display: "none", zIndex: 1000000 }:{opacity: 1, display: "block", zIndex: 1000000 }}
        transition={{
          delay: 2,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="fixed overflow-hidden inset-0 w-screen h-screen"
      >
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity:1}}
          transition={{
            delay: 4,
            duration: 0.5,
            ease: "easeInOut",
          }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-20 z-1000000 "
        >
          <OrbitProgress color="#8391a7" size="small" text="" textColor=""/>
        </motion.div>
        <WelcomeLoad />
      </motion.div>

      {isAdminRoute ? (
        isAdmin && <Sidebar /> //navbar admin
      ) : (
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> //navbar user
      )}

      <Routes>
        {/* Route công khai */}

        <Route
          path="/"
          element={
            <>
              <Home />
              <Footer />
            </>
          }
        />
        {!isLoggedIn && (
          <Route path="/Login" element={ <LoginPage onLogin={() => setIsLoggedIn(true)} setIsAdmin={setIsAdmin} /> } />
        )}
        {/* Redirect nếu người dùng đã đăng nhập */}
        {isLoggedIn && (
          <>
            <Route path="/Login" element={<Navigate to="/" replace />} />
          </>
        )}
        <Route
          path="/SignUp"
          element={
            <>
              <SignupPage />
            </>
          }
        />
        <Route
          path="/ForgotPass"
          element={
            <>
              <ForgotPassword />
            </>
          }
        />
        <Route
          path="/ResetPassword/:token"
          element={
            <>
              <ResetPasswordPage />
            </>
          }
        />
        {isLoggedIn && (
          <Route path="/Profile" element={ <ProfilePage setIsLoggedIn={setIsLoggedIn} />} />
        )}
        {/* Redirect nếu người dùng chưa đăng nhập */}
        {!isLoggedIn && (
          <>
            <Route path="/Profile" element={<Navigate to="/" replace />} />
          </>
        )}
        <Route
          path="/movie/:id"
          element={
            <>
              <MovieDetail />
              <Footer />
            </>
          }
        />
        <Route 
          path="/search/:searchTerm" 
          element={
             <>
              <SearchPage />
              <Footer />
            </>
          } 
        />
        {/* Admin routes */}
        {isAdmin && (
          <>
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/admin/movies" element={<DashboardMovieAdmin />} />
            <Route path="/admin/movies/create" element={<MovieCreate />} />
          </>
        )}

        {/* Redirect nếu người dùng cố vào /admin mà không có quyền */}
        {!isAdmin && (
          <>
            <Route path="/admin" element={<Navigate to="/" replace />} />
            <Route path="/admin/movies" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default AppRouter;
