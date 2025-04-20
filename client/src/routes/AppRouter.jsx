import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "../pages/Login";
import SignupPage from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPass";
import Navbar from "../components/Navbar";
import Sidebar from "../components/admin/layout/Sidebar";
import { refreshAccessToken } from "../services/RefreshAccessTokenAPI";
import Home from "../pages/Home";
import HomeAdmin from "../pages/admin/HomeAdmin"
import { motion } from "motion/react";
import WelcomeLoad from "../components/WelcomeLoad";
import MovieDetail from "../pages/MovieDetail";
import Footer from "../components/Footer";
import ProfilePage from "../pages/ProfilePage";
 import SearchPage from "../pages/SearchPage";
import AdminRoute from "./adminRoutes";
import {OrbitProgress} from "react-loading-indicators";
import { useLoading } from "../contexts/LoadingContext";
// import Sidebar from "../components/admin/Sidebar";
// import MovieManagement from "../pages/admin/movies/MovieManagement";

const AppRouter = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const { isLoading, setLoading } = useLoading();

  //kiểm tra phiên đăng nhập
  useEffect(() => {
    const checkLoginStatus = async () => {
      fetch("http://localhost:8000/api/user", {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (response.status === 401) { //access token hết hạn
            refreshAccessToken(() => { checkLoginStatus() });
            return;
          }
          return response.json();
        })
        .then((data) => {
          if (!data) {
            setLoading(false);
            return;
          };

          setIsLoggedIn(true);

          if (data.isAdmin) {
            console.log("isAdmin:", data.isAdmin);
            setIsAdmin(true);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin user:", error);
        });
    }
    checkLoginStatus();
  }, []);

  useEffect(() => {
    setLoading(true);
  
    // giả sử sau 3s nếu chưa tắt thì auto tắt (để tránh kẹt)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);
  
    return () => clearTimeout(timeout);
  }, [location.pathname]);

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
        isAdmin && <Sidebar />//navbar admin
      ) : (
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>//navbar user
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
        <Route
          path="/Login"
          element={
            <>
              <LoginPage onLogin={() => setIsLoggedIn(true)} setIsAdmin={setIsAdmin} />
            </>
          }
        />
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
        {isLoggedIn && (
          <Route
            path="/Profile"
            element={
              <>
                <ProfilePage setIsLoggedIn={setIsLoggedIn} />
              </>
            }
          />
        )}
        {/* Redirect nếu người dùng chưa đăng nhập */}
        {!isLoggedIn && (
          <>
            <Route
              path="/Profile"
              element={<Navigate to="/" replace />}
            />
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
            <Route path="/admin" element={<HomeAdmin />} />
            <Route path="/admin/movies" element={<HomeAdmin />} />
          </>
        )}

        {/* Redirect nếu người dùng cố vào /admin mà không có quyền */}
        {!isAdmin && (
          <>
            <Route
              path="/admin"
              element={<Navigate to="/" replace />}
            />
            <Route
              path="/admin/movies"
              element={<Navigate to="/" replace />}
            />
          </>
        )}
      </Routes>
    </>
  );
};

export default AppRouter;
