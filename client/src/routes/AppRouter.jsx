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
import { HandleGetUser } from "../services/HandlerUserService";
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
import { OrbitProgress } from "react-loading-indicators";
import { useLoading } from "../contexts/LoadingContext";
import Sidebar from "../components/admin/layout/Sidebar";
import DashboardAdmin from "../pages/admin/movies/DashboardAdmin";
import MovieUpdate from "../components/admin/movies/MovieUpdate";

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
      try {
        const userData = await HandleGetUser();

        if (userData) {
          setIsLoggedIn(true);
          if (userData.isAdmin) {
            console.log("isAdmin:", userData.isAdmin);
            setIsAdmin(true);
          }
        }
      } catch (error) {
        // Nếu có lỗi 401 (Unauthorized), thử refresh token
        if (error.message.includes("401")) {
          try {
            await refreshAccessToken(() => {
              checkLoginStatus();
            }, setIsLoggedIn);
          } catch (refreshError) {
            console.error("Lỗi khi refresh token:", refreshError);
          }
        } else {
          console.error("Lỗi khi lấy thông tin user:", error);
        }
      } finally {
        setisCheckingUser(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    console.log("isLoading đã đổi:", isLoggedIn);
  }, [isLoggedIn]);

  if (isCheckingUser) {
    return (
      <motion.div
        initial={{ opacity: 1, display: "block", zIndex: 1000000 }}
        animate={
          isLoading
            ? { opacity: 0, display: "none", zIndex: 1000000 }
            : { opacity: 1, display: "block", zIndex: 1000000 }
        }
        transition={{
          delay: 2,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="fixed inset-0 w-screen h-screen overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 4,
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="absolute transform -translate-x-1/2 translate-y-40 top-1/2 left-1/2 z-1000000 "
        >
          <OrbitProgress color="#8391a7" size="small" text="" textColor="" />
        </motion.div>
        <WelcomeLoad />
      </motion.div>
    );
  }

  return (
    <>
      {!isAdmin && (
        <motion.div
          initial={{ opacity: 1, display: "block", zIndex: 1000000 }}
          animate={
            !isLoading
              ? { opacity: 0, display: "none", zIndex: 1000000 }
              : { opacity: 1, display: "block", zIndex: 1000000 }
          }
          transition={{
            delay: 2,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="fixed inset-0 w-screen h-screen overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 4,
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="absolute transform -translate-x-1/2 translate-y-40 top-1/2 left-1/2 z-1000000 "
          >
            <OrbitProgress color="#8391a7" size="small" text="" textColor="" />
          </motion.div>
          <WelcomeLoad />
        </motion.div>
      )}

      {isAdminRoute ? (
        isAdmin && <Sidebar setIsLoggedIn={setIsLoggedIn} /> //navbar admin
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
          <Route
            path="/Login"
            element={
              <LoginPage
                onLogin={() => setIsLoggedIn(true)}
                setIsAdmin={setIsAdmin}
              />
            }
          />
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
          <Route
            path="/Profile"
            element={<ProfilePage setIsLoggedIn={setIsLoggedIn} />}
          />
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
            <Route path="/admin/movies/update/:id" element={<MovieUpdate />} />
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
