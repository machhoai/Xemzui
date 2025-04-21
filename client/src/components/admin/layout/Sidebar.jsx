import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  HomeOutlined,
  DatabaseOutlined,
  UserOutlined,
  CommentOutlined,
  StarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`
        bg-dark-primary 
        text-white 
        h-screen 
        fixed 
        left-0 
        top-0 
        transition-all 
        duration-300 
        ${collapsed ? "w-20" : "w-64"}
        shadow-lg
        flex 
        flex-col
      `}
    >
      {/* Sidebar Header */}
      <div
        className="
          flex 
          items-center 
          justify-between 
          p-4 
          border-b 
          border-dark-secondary
        "
      >
        {!collapsed && (
          <div className="flex items-center">
            {/* <img
              src="/api/placeholder/40/40"
              alt=""
              className="w-10 h-10 mr-3 rounded-full"
            /> */}
            <span className="font-bold text-lg">XemZui</span>
          </div>
        )}
        <button
          onClick={toggleCollapsed}
          className="
            hover:bg-dark-secondary 
            p-2 
            rounded-full 
            text-white 
            focus:outline-none
          "
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      {/* Navigation Menu */}
      <Menu
        defaultSelectedKeys={["2"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        className="
          bg-dark-primary 
          text-white 
          border-r-0 
          flex-grow
        "
      >
        <Menu.Item
          key="1"
          icon={<HomeOutlined />}
          className="
            hover:bg-dark-secondary 
            text-white 
            hover:text-white
          "
        >
          <Link to="/admin">Dashboard</Link>
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={<DatabaseOutlined />}
          className="
            bg-dark-secondary 
            text-white
            hover:bg-dark-secondary 
            hover:text-white
          "
        >
          <Link to="/admin/movies">Catalog</Link>
        </Menu.Item>
        <Menu.Item
          key="3"
          icon={<DatabaseOutlined />}
          className="
            hover:bg-dark-secondary 
            text-white 
            hover:text-white
          "
        >
          <Link to="/admin/movies/create">Add Movie</Link>
        </Menu.Item>
        <Menu.Item
          key="4"
          icon={<UserOutlined />}
          className="
            hover:bg-dark-secondary 
            text-white 
            hover:text-white
          "
        >
          Users
        </Menu.Item>
      </Menu>

      {/* Footer */}
      <div
        className="
          p-4 
          border-t 
          border-dark-secondary 
          cursor-pointer 
          hover:bg-dark-secondary
        "
      >
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="mr-4">↩</span>
            {!collapsed && <span>Back to XemZui</span>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;