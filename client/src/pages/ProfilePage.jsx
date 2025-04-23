import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaHeart,
  FaSignOutAlt,
  FaEdit,
} from "react-icons/fa";
import {
  HandlerUserLogout,
  HandlerGetUserInfo,
  HandlerUpdateUserInfo,
  HandlerChangePassword,
} from "../services/HandlerUserService";
import { useLoading } from "../contexts/LoadingContext";
const ProfilePage = (setIsLoggedIn) => {
  const { setLoading } = useLoading();
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const favoriteMovies = [
    {
      id: 1,
      title: "Avengers: Endgame",
      year: 2019,
      poster: "https://via.placeholder.com/150x225?text=Avengers",
    },
    {
      id: 2,
      title: "Spider-Man: No Way Home",
      year: 2021,
      poster: "https://via.placeholder.com/150x225?text=Spider-Man",
    },
    {
      id: 3,
      title: "The Batman",
      year: 2022,
      poster: "https://via.placeholder.com/150x225?text=Batman",
    },
    {
      id: 4,
      title: "Dune",
      year: 2021,
      poster: "https://via.placeholder.com/150x225?text=Dune",
    },
    {
      id: 5,
      title: "Interstellar",
      year: 2014,
      poster: "https://via.placeholder.com/150x225?text=Interstellar",
    },
  ];

  useEffect(() => {
    setLoading(true);
    HandlerGetUserInfo(setUser, setIsLoggedIn);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    HandlerUserLogout(setIsLoggedIn);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp không
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    HandlerChangePassword(currentPassword, newPassword);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Xử lý cập nhật thông tin
    setIsEditing(false);
    HandlerUpdateUserInfo(user);
  };

  return (
    <div className="min-h-screen px-4 bg-gray-500 pt-25 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="overflow-hidden bg-white rounded-lg shadow">
          {/* Header */}
          <div className="p-6 text-white bg-gradient-to-r from-purple-600 to-blue-500">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Hồ Sơ Cá Nhân</h1>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 transition bg-white rounded-lg hover:bg-gray-100"
              >
                <FaSignOutAlt /> Đăng Xuất
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
            {/* Thông tin cá nhân */}
            <div className="md:col-span-1">
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <div className="flex flex-col items-center mb-4">
                  <div className="flex items-center justify-center w-24 h-24 mb-3 bg-purple-100 rounded-full">
                    <FaUser className="text-3xl text-purple-500" />
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                      className="px-2 py-1 mb-1 text-lg font-bold text-center border rounded"
                    />
                  ) : (
                    <h2 className="text-lg font-bold text-center">
                      {user.name}
                    </h2>
                  )}
                  <div className="flex items-center text-gray-600">
                    <FaEnvelope className="mr-2" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                        className="px-2 py-1 border rounded"
                      />
                    ) : (
                      <span>{user.email}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-center">
                  {isEditing ? (
                    <button
                      onClick={handleProfileUpdate}
                      className="px-4 py-2 text-white transition bg-green-500 rounded-lg hover:bg-green-600"
                    >
                      Lưu thay đổi
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-white transition bg-purple-500 rounded-lg hover:bg-purple-600"
                    >
                      <FaEdit /> Chỉnh sửa
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Đổi mật khẩu */}
            <div className="md:col-span-1">
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <h3 className="flex items-center mb-4 text-lg font-bold">
                  <FaLock className="mr-2 text-purple-500" /> Đổi mật khẩu
                </h3>
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-3">
                    <label className="block mb-1 text-gray-700">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1 text-gray-700">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 text-gray-700">
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 text-white transition bg-purple-500 rounded-lg hover:bg-purple-600"
                  >
                    Đổi mật khẩu
                  </button>
                </form>
              </div>
            </div>

            {/* Phim yêu thích */}
            <div className="md:col-span-1">
              <div className="flex flex-col h-full p-4 rounded-lg shadow-sm bg-gray-50">
                <h3 className="flex items-center mb-4 text-lg font-bold">
                  <FaHeart className="mr-2 text-red-500" /> Phim yêu thích
                </h3>

                {favoriteMovies.length === 0 ? (
                  <p className="py-4 text-center text-gray-500">
                    Bạn chưa có phim yêu thích nào
                  </p>
                ) : (
                  <div className="pr-2 overflow-y-auto max-h-96">
                    {" "}
                    {/* Thêm thanh cuộn với chiều cao tối đa */}
                    <div className="space-y-3">
                      {favoriteMovies.map((movie) => (
                        <div
                          key={movie.id}
                          className="flex items-center p-2 transition bg-white rounded shadow-sm hover:shadow-md"
                        >
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="flex-shrink-0 object-cover w-12 h-16 rounded"
                          />
                          <div className="min-w-0 ml-3">
                            {" "}
                            {/* Thêm min-w-0 để tránh tràn nội dung */}
                            <h4 className="font-medium truncate">
                              {movie.title}
                            </h4>{" "}
                            {/* Thêm truncate để tự động cắt bớt nếu quá dài */}
                            <p className="text-sm text-gray-500">
                              {movie.year}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
