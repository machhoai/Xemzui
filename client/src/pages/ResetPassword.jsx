import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { HandlerResetPassword } from '../services/HandlerUserService';
import { useLoading } from '../contexts/LoadingContext';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Lấy token từ URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { setLoading } = useLoading();
  setLoading(false);
  // Validate password
  const validatePassword = (pwd) => {
    return pwd.length >= 8 && pwd.length <= 25;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      alert('Mật khẩu phải có độ dài từ 8 đến 25 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }

    // Gửi yêu cầu reset password đến server ở đây
    console.log('Password reset to:', password);
    // Gọi hàm reset password
    HandlerResetPassword(token, password, setIsSubmitted);
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 8) return 1;
    if (password.length < 12) return 2;
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) return 3;
    return 4;
  };

  const strengthLabels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-800 p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <div className="text-center">
            <FaCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt lại mật khẩu thành công!</h2>
            <p className="text-gray-600 mb-6">Mật khẩu của bạn đã được thay đổi. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.</p>
            <a
              href="/login"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Đăng nhập ngay
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-800 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <FaLock className="text-purple-600 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Đặt lại mật khẩu</h1>
          <p className="text-gray-600 mt-2">Vui lòng nhập mật khẩu mới của bạn</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="Nhập mật khẩu mới"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex items-center mb-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${strengthColors[getPasswordStrength()]}`}
                      style={{ width: `${(getPasswordStrength() / 4) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-600">
                    {strengthLabels[getPasswordStrength()]}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Mật khẩu phải có 8-25 ký tự. {password.length < 8 && `Còn thiếu ${8 - password.length} ký tự.`}
                </p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Nhập lại mật khẩu
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-xs text-red-500">Mật khẩu không khớp!</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-md"
          >
            Đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;