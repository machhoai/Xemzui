import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { HandleGetUser } from "../services/HandlerUserService"; // Import hàm HandleGetUser

const AdminRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await HandleGetUser();
        setUser(userData);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;