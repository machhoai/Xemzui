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
import MovieCreate from "../components/admin/movies/MovieCreate";
import Sidebar from "../components/admin/layout/Sidebar";
import DashboardAdmin from "../pages/admin/movies/DashboardAdmin";

const AppRouter = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [loading, setLoading] = useState(true);

  //kiểm tra phiên đăng nhập
  useEffect(() => {
    const checkLoginStatus = async () => {
      fetch("http://localhost:8000/api/user", {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (response.status === 401) {
            //access token hết hạn
            refreshAccessToken(() => {
              checkLoginStatus();
            });
            return;
          }
          return response.json();
        })
        .then((data) => {
          if (!data) {
            setLoading(false);
            return;
          }

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
    };
    checkLoginStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
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
        <Route
          path="/Login"
          element={
            <>
              <LoginPage
                onLogin={() => setIsLoggedIn(true)}
                setIsAdmin={setIsAdmin}
              />
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
