import { Link, useNavigate } from 'react-router-dom';
import { FaFilm, FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './css/Navbar.css';

const Navbar = ({isLoggedIn}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Xử lý đăng xuất
        console.log('Đăng xuất');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="logo">
                    <FaFilm className="film-icon" />
                    <span>XemZui</span>
                </Link>

                <div className="search-bar">
                    <input type="text" placeholder="Tìm kiếm phim..." />
                    <button type="button" className="search-button">
                        <FaSearch />
                    </button>
                </div>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Trang chủ</Link>
                    <Link to="/" className="nav-link">Thể loại</Link>
                    <Link to="/" className="nav-link">Duyệt Tìm</Link>
                    <Link to="/" className="nav-link">Phim Bộ</Link>
                    <Link to="/" className="nav-link">Phim lẻ</Link>
                    <Link to="/" className="nav-link">Quốc Gia</Link>
                    
                    {isLoggedIn ? (
                        <div className="user-dropdown">
                            <button className="user-button">
                                <FaUserCircle className="user-icon" />
                            </button>
                            <div className="dropdown-content">
                                <Link to="/profile" className="dropdown-item">Hồ sơ</Link>
                                <button onClick={handleLogout} className="dropdown-item">
                                    <FaSignOutAlt /> Đăng xuất
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="login-button">Đăng nhập</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;