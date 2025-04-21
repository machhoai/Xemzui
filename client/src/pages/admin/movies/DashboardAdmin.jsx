import React from "react";
import { Card, Row, Col, Statistic, Progress, Space, Divider } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  StarOutlined,
  ArrowUpOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

const DashboardAdmin = () => {
  // Dummy data - thay bằng API thực tế sau
  const stats = {
    users: 1245,
    movies: 586,
    ratings: 8924,
    newUsers: 28,
    completion: 78,
  };

  const recentActivities = [
    { id: 1, user: "Nguyễn Văn A", action: "đã thêm phim mới", movie: "Dune: Part Two", time: "5 phút trước" },
    { id: 2, user: "Trần Thị B", action: "đã đánh giá", movie: "Oppenheimer", rating: 5, time: "12 phút trước" },
    { id: 3, user: "Lê Văn C", action: "đã đăng ký tài khoản", time: "25 phút trước" },
  ];

  return (
    <div className="ml-64 flex-1 min-h-screen bg-gray-50 p-6 transition-all duration-300">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Xin chào, Admin!</h1>
        <p className="text-gray-600">Chào mừng bạn đến với trang quản trị XemZui</p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Tổng người dùng"
              value={stats.users}
              prefix={<UserOutlined className="text-blue-500" />}
              suffix={
                <span className="text-green-500 text-sm">
                  +{stats.newUsers} <ArrowUpOutlined />
                </span>
              }
            />
            <Progress percent={stats.completion} size="small" showInfo={false} strokeColor="#3B82F6" />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Tổng phim"
              value={stats.movies}
              prefix={<VideoCameraOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Đánh giá"
              value={stats.ratings}
              prefix={<StarOutlined className="text-yellow-500" />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Hoạt động hôm nay"
              value={42}
              prefix={<FileDoneOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Recent Activities */}
        <Col xs={24} lg={16}>
          <Card 
            title="Hoạt động gần đây" 
            className="shadow-sm h-full"
            headStyle={{ borderBottom: 0 }}
          >
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <UserOutlined className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="m-0">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                      {activity.movie && <span className="font-medium"> "{activity.movie}"</span>}
                      {activity.rating && <span className="ml-1">⭐️ {activity.rating}/5</span>}
                    </p>
                    <p className="m-0 text-gray-500 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={8}>
          <Card 
            title="Thao tác nhanh" 
            className="shadow-sm h-full"
            headStyle={{ borderBottom: 0 }}
          >
            <Space direction="vertical" className="w-full">
              <button className="w-full text-left p-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                Thêm phim mới
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">
                Quản lý người dùng
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                Xem báo cáo
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors">
                Cài đặt hệ thống
              </button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Charts Section - Placeholder */}
      <Card className="mt-6 shadow-sm">
        <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-500">Biểu đồ thống kê sẽ được hiển thị tại đây</p>
        </div>
      </Card>
    </div>
  );
};

export default DashboardAdmin;