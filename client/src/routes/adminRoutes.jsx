import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const AdminRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API để lấy thông tin user
    fetch("http://localhost:8000/api/user", {
      method: "GET",
      credentials: "include", 
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin user:", error);
        setUser(null);
        setLoading(false);
      });
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