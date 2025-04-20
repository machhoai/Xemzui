import React from "react";
import Sidebar from "../../../components/admin/layout/Sidebar";

const DashboardAdmin = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 bg-gray-800 text-white fixed h-full z-10">
        <Sidebar />
      </div>
      <div className="ml-64 flex-1 overflow-y-auto h-full bg-gray-800 p-6">
        <h1>Xin chào, Admin!</h1>
        <p>Chào mừng bạn đến với trang quản trị của Xemzui.</p>
      </div>
    </div>
  );
};

export default DashboardAdmin;
