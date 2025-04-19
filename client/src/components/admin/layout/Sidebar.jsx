import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { VideoCameraOutlined, UserOutlined } from '@ant-design/icons';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed top-0 left-0 flex flex-col">
      <h1 className="text-2xl font-bold p-4 border-b border-gray-700">Admin</h1>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['movies']}
        className="bg-gray-900"
      >
        <Menu.Item key="movies" icon={<VideoCameraOutlined />}>
          <Link to="/admin/movies">Quản lý Movie</Link>
        </Menu.Item>
        <Menu.Item key="users" icon={<UserOutlined />}>
          <Link to="/admin/users">Quản lý User</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;