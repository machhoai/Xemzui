import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaSignOutAlt, FaCaretDown, FaMobileAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const Header = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    console.log('Đăng xuất');
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 px-6 py-3 flex items-center justify-between font-medium ${isScrolled ? 'bg-[#0F111A]' : 'bg-transparent'}`}>
        <a href="/phimhay" className="flex items-center gap-2">
          <div className="text-left leading-tight">
            <span className="text-white text-xl font-semibold">XemZui</span><br />
            <span className="text-xs text-gray-300">Cười rụng rổ</span>
          </div>
        </a>
        <div className="hidden md:flex items-center bg-[#2f2f2f] rounded-lg px-4 py-2 w-80 ml-6 focus-within:ring-2 focus-within:ring-white">
          <FaSearch className="text-white mr-2" />
          <input
            type="text"
            placeholder="Tìm kiếm phim, diễn viên"
            className="bg-transparent outline-none text-sm text-white flex-grow placeholder:text-gray-400"
          />
        </div>
        <nav className="text-white hidden lg:flex items-center gap-6 text-sm mx-8">
          <Link to="/chu-de" className="hover:text-yellow-400">Chủ Đề</Link>
          <Link to="/duyet-tim" className="hover:text-yellow-400">Duyệt tìm</Link>
          <Link to="/phim-le" className="hover:text-yellow-400">Phim Lẻ</Link>
          <Link to="/phim-bo" className="hover:text-yellow-400">Phim Bộ</Link>
          <div className="relative group">
            <span className="flex items-center cursor-pointer hover:text-yellow-400">
              Quốc gia <FaCaretDown className="ml-1 text-xs" />
            </span>
            <div className="absolute hidden group-hover:block bg-white text-black mt-2 rounded shadow-lg w-40 z-50">
              <Link to="/quoc-gia/vn" className="block px-4 py-2 hover:bg-gray-100">Việt Nam</Link>
              <Link to="/quoc-gia/us" className="block px-4 py-2 hover:bg-gray-100">Mỹ</Link>
              <Link to="/quoc-gia/kr" className="block px-4 py-2 hover:bg-gray-100">Hàn Quốc</Link>
            </div>
          </div>
          <Link to="/dien-vien" className="hover:text-yellow-400">Diễn Viên</Link>
          <Link to="/lich-chieu" className="hover:text-yellow-400">Lịch chiếu</Link>
        </nav>
        <div className="flex items-center gap-4 ml-auto">
          <div className="hidden md:flex items-center bg-[#2f2f2f] text-white px-3 py-1 rounded-full hover:bg-[#3a3a3a]">
            <FaMobileAlt className="text-yellow-400 mr-2" />
            <div className="text-left text-xs">
              <span className="text-gray-300">Tải ứng dụng</span><br />
              <strong className="text-white text-sm">RoPhim</strong>
            </div>
          </div>
          {isLoggedIn ? (
            <div className="relative group">
              <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100">
                <FaUserCircle className="text-lg" />
                <span className="text-sm font-medium">Thành viên</span>
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md hidden group-hover:block z-50">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Hồ sơ</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaSignOutAlt /> Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-black px-4 py-2 rounded-full text-sm hover:bg-gray-100">
              <FaUserCircle className="inline mr-2" /> Đăng nhập
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
