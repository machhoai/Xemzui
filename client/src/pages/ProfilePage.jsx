import { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaHeart, FaSignOutAlt, FaEdit } from 'react-icons/fa';
import { HandlerUserLogout, HandlerGetUserInfo, HandlerUpdateUserInfo, HandlerChangePassword } from '../services/HandlerUserService';
import { useLoading } from '../contexts/LoadingContext';
const ProfilePage = ({ setIsLoggedIn }) => {
    const { setLoading } = useLoading();
    const [user, setUser] = useState({
        name: '',
        email: '',
    });
    

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const favoriteMovies = [
        { id: 1, title: 'Avengers: Endgame', year: 2019, poster: 'https://via.placeholder.com/150x225?text=Avengers' },
        { id: 2, title: 'Spider-Man: No Way Home', year: 2021, poster: 'https://via.placeholder.com/150x225?text=Spider-Man' },
        { id: 3, title: 'The Batman', year: 2022, poster: 'https://via.placeholder.com/150x225?text=Batman' },
        { id: 4, title: 'Dune', year: 2021, poster: 'https://via.placeholder.com/150x225?text=Dune' },
        { id: 5, title: 'Interstellar', year: 2014, poster: 'https://via.placeholder.com/150x225?text=Interstellar' },
    ];

    useEffect(() => {
        HandlerGetUserInfo(setUser, setIsLoggedIn);
        setLoading(false);
    },[])

    const handleLogout = () => {
        HandlerUserLogout({ setIsLoggedIn });
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        // kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp không
        if (newPassword !== confirmPassword) {
            alert('Mật khẩu mới không khớp!');
            return;
        }
        HandlerChangePassword(currentPassword, newPassword)
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        // Xử lý cập nhật thông tin
        setIsEditing(false);
        HandlerUpdateUserInfo(user)
    };

    return (
        <div className="min-h-screen bg-gray-500 pt-25 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">Hồ Sơ Cá Nhân</h1>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                <FaSignOutAlt /> Đăng Xuất
                            </button>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Thông tin cá nhân */}
                        <div className="md:col-span-1">
                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <div className="flex flex-col items-center mb-4">
                                    <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                                        <FaUser className="text-purple-500 text-3xl" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={user.name}
                                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                                            className="text-center font-bold text-lg mb-1 border rounded px-2 py-1"
                                        />
                                    ) : (
                                        <h2 className="text-center font-bold text-lg">{user.name}</h2>
                                    )}
                                    <div className="flex items-center text-gray-600">
                                        <FaEnvelope className="mr-2" />
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={user.email}
                                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                                className="border rounded px-2 py-1"
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
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                        >
                                            Lưu thay đổi
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
                                        >
                                            <FaEdit /> Chỉnh sửa
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Đổi mật khẩu */}
                        <div className="md:col-span-1">
                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <h3 className="font-bold text-lg mb-4 flex items-center">
                                    <FaLock className="mr-2 text-purple-500" /> Đổi mật khẩu
                                </h3>
                                <form onSubmit={handlePasswordChange}>
                                    <div className="mb-3">
                                        <label className="block text-gray-700 mb-1">Mật khẩu hiện tại</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full border rounded px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-gray-700 mb-1">Mật khẩu mới</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full border rounded px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 mb-1">Xác nhận mật khẩu</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full border rounded px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
                                    >
                                        Đổi mật khẩu
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Phim yêu thích */}
                        <div className="md:col-span-1">
                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm h-full flex flex-col">
                                <h3 className="font-bold text-lg mb-4 flex items-center">
                                    <FaHeart className="mr-2 text-red-500" /> Phim yêu thích
                                </h3>

                                {favoriteMovies.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">Bạn chưa có phim yêu thích nào</p>
                                ) : (
                                    <div className="overflow-y-auto max-h-96 pr-2"> {/* Thêm thanh cuộn với chiều cao tối đa */}
                                        <div className="space-y-3">
                                            {favoriteMovies.map((movie) => (
                                                <div
                                                    key={movie.id}
                                                    className="flex items-center bg-white p-2 rounded shadow-sm hover:shadow-md transition"
                                                >
                                                    <img
                                                        src={movie.poster}
                                                        alt={movie.title}
                                                        className="w-12 h-16 object-cover rounded flex-shrink-0"
                                                    />
                                                    <div className="ml-3 min-w-0"> {/* Thêm min-w-0 để tránh tràn nội dung */}
                                                        <h4 className="font-medium truncate">{movie.title}</h4> {/* Thêm truncate để tự động cắt bớt nếu quá dài */}
                                                        <p className="text-sm text-gray-500">{movie.year}</p>
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