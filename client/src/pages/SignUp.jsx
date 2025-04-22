import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
// import '../pages/css/Signup.css';
import { useLoading } from '../contexts/LoadingContext';

const SignupPage = () => {
    const { setLoading } = useLoading();

    setTimeout(() => {
        setLoading(false);
    }, 100);

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        showPassword: false
    });

    const [errors, setErrors] = useState({
        fullname: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            fullname: '',
            email: '',
            password: ''
        };

        // Validate fullname
        if (!formData.fullname.trim()) {
            newErrors.fullname = 'Họ tên không được để trống';
            valid = false;
        }

        // Validate email
        if (!formData.email.endsWith('@gmail.com')) {
            newErrors.email = 'Email phải có đuôi @gmail.com';
            valid = false;
        }

        // Validate password
        if (formData.password.length < 8 || formData.password.length > 25) {
            newErrors.password = 'Mật khẩu phải từ 8 đến 25 ký tự';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Xử lý đăng ký
            console.log('Đăng ký thành công:', formData);
            // Gửi dữ liệu đến API hoặc xử lý tiếp
            fetch('http://localhost:8000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    fullName: formData.fullname,
                    email: formData.email,
                    password: formData.password
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (!data) return;
                    alert(data.message);
                    console.log('Dữ liệu:', data);
                    window.location.href = "/login";
                })
                .catch((error) => {
                    console.error('Lỗi:', error);
                });
        }
    };

    const togglePasswordVisibility = () => {
        setFormData({
            ...formData,
            showPassword: !formData.showPassword
        });
    };



    return (
        <div className="signup-container">
            <div className="signup-box">
                <div className="signup-header">
                    <h1>Đăng Ký Tài Khoản</h1>
                    <p>Tham gia cùng XemZui Movie ngay hôm nay</p>
                </div>

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="fullname">
                            <FaUser className="input-icon" /> Họ và tên
                        </label>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên đầy đủ"
                        />
                        {errors.fullname && <span className="error-message">{errors.fullname}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            <FaEnvelope className="input-icon" /> Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@gmail.com"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <FaLock className="input-icon" /> Mật khẩu
                        </label>
                        <div className="password-input">
                            <input
                                type={formData.showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu (8-25 ký tự)"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={togglePasswordVisibility}
                            >
                                {formData.showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <button type="submit" className="signup-button">Đăng Ký</button>
                </form>

                <div className="login-redirect">
                    Đã có tài khoản? <Link to="/Login">Đăng nhập ngay</Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;