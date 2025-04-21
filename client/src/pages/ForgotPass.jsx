import { useState } from 'react';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { HandlerSendLinkResetPassword } from '../services/HandlerUserService';
import './css/ForgotPass.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    if (!email.endsWith('@gmail.com')) {
      setEmailError('Email phải có đuôi @gmail.com');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    
    // Giả lập gửi email reset mật khẩu
    try {
      await HandlerSendLinkResetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Lỗi gửi email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <Link to="/login" className="back-button">
          <FaArrowLeft /> Quay lại đăng nhập
        </Link>

        <div className="forgot-password-header">
          <h1>Quên Mật Khẩu</h1>
          <p>
            {isSubmitted 
              ? "Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn"
              : "Nhập email để nhận liên kết khôi phục mật khẩu"}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="input-icon" /> Email đăng ký
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                placeholder="example@gmail.com"
                className={emailError ? 'error' : ''}
              />
              {emailError && <span className="error-message">{emailError}</span>}
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Đang gửi...' : 'Gửi Liên Kết'}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>Vui lòng kiểm tra hộp thư email <strong>{email}</strong></p>
            <p>Nếu không thấy email, hãy kiểm tra thư mục spam</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;