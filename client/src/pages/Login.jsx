import { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaFilm } from "react-icons/fa";
import { Link } from "react-router-dom";
import { HandlerUserLogin } from "../services/HandlerUserService";
import "./css/Login.css";

const LoginPage = ({ onLogin, setIsAdmin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate email
    if (!email.endsWith("@gmail.com")) {
      setEmailError("Email phải có đuôi @gmail.com");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate password
    if (password.length < 3) {
      setPasswordError("Mật khẩu phải có ít nhất 8 ký tự");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      // Gọi API đăng nhập
      HandlerUserLogin(email, password, onLogin, setIsAdmin);
    };
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <FaFilm className="film-icon" />
          <h1>XemZui Movie</h1>
        </div>

        <h2>Đăng Nhập</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              className={emailError ? "error" : ""}
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className={passwordError ? "error" : ""}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordError && (
              <span className="error-message">{passwordError}</span>
            )}
          </div>

          <div className="forgot-password">
            <Link to="/ForgotPass">Quên mật khẩu?</Link>
          </div>

          <button type="submit" className="login-button">
            Đăng Nhập
          </button>
        </form>

        <div className="signup-link">
          Chưa có tài khoản? <Link to="/SignUp">Tạo tài khoản</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
