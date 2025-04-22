import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Button, Tooltip } from "antd";
import {
  HomeOutlined,
  DatabaseOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { HandlerUserLogout } from "../../../services/HandlerUserService";

const Sidebar = ({ setIsLoggedIn }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("1");

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    HandlerUserLogout({ setIsLoggedIn });
  };

  return (
    <div
      className={`
        bg-gray-900 
        text-white 
        h-screen 
        fixed 
        left-0 
        top-0 
        transition-all 
        duration-300 
        ${collapsed ? "w-20" : "w-64"}
        flex
        flex-col
        z-10
        shadow-xl
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <Link to="/admin" className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 mr-2 bg-blue-600 rounded-md">
              <span className="font-bold text-white">XZ</span>
            </div>
            <span className="text-lg font-bold text-white">XemZui</span>
          </Link>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          className="
            !text-gray-400 hover:!text-white
            !transition-all !duration-200
            hover:!bg-gray-800
            !rounded-lg
            !w-10 !h-10
            !flex !items-center !justify-center
          "
        />
      </div>

      {/* User Profile */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full">
            <UserOutlined style={{ fontSize: "18px" }} />
          </div>
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <div className="text-xs text-gray-400 truncate">Admin</div>
              <div className="font-medium text-white truncate">Quang Tuoi</div>
            </div>
          )}
        </div>
        <Tooltip title="Logout" placement="right">
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="
              !text-gray-400 hover:!text-red-500 
              !transition-all !duration-200
              hover:!bg-gray-700
              !rounded-full
              !w-10 !h-10
              !flex !items-center !justify-center
            "
          />
        </Tooltip>
      </div>

      {/* Navigation Menu */}
      <Menu
        selectedKeys={[activeKey]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        className="
          bg-gray-900 
          border-r-0 
          flex-grow
          [&_.ant-menu-item]:!mx-2
          [&_.ant-menu-item]:!rounded-lg
          [&_.ant-menu-item]:!h-10
          [&_.ant-menu-item]:!flex
          [&_.ant-menu-item]:!items-center
        "
      >
        <Menu.Item
          key="1"
          icon={<HomeOutlined />}
          onClick={() => setActiveKey("1")}
          className="
            !text-gray-400 hover:!text-white
            hover:!bg-gray-800
            !transition-all
          "
        >
          <Link to="/admin">Dashboard</Link>
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={<DatabaseOutlined />}
          onClick={() => setActiveKey("2")}
          className="
            !text-gray-400 hover:!text-white
            hover:!bg-gray-800
            !transition-all
          "
        >
          <Link to="/admin/movies">Catalog</Link>
        </Menu.Item>
        <Menu.Item
          key="3"
          icon={<PlusOutlined />}
          onClick={() => setActiveKey("3")}
          className="
            !text-gray-400 hover:!text-white
            hover:!bg-gray-800
            !transition-all
          "
        >
          <Link to="/admin/movies/create">Add Movie</Link>
        </Menu.Item>
      </Menu>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <Link
          to="/"
          className="flex items-center text-gray-400 transition-colors duration-200 hover:text-white"
        >
          <ArrowLeftOutlined className="mr-2" />
          {!collapsed && <span>Back to Main Site</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
