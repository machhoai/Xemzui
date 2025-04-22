import { Link } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaSignOutAlt, FaCaretDown, FaMobileAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { HandlerUserLogout } from '../services/HandlerUserService'; 
import { useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const res = await fetch(`https://xemzui-production.up.railway.app/api/movies?search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setSearchResults(data.movies || []);
      setShowDropdown(true);
    } catch (err) {
      console.error('Lỗi tìm kiếm phim:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gọi API tìm kiếm mỗi khi searchTerm thay đổi
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.length > 1) {
        handleSearch();
      } else {
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleLogout = () => {
    HandlerUserLogout(setIsLoggedIn);
  };

  return (
    <div className="flex flex-col">
      <header
        className={`fixed top-0 left-0 w-full z-50 px-6 py-3 flex items-center justify-between font-medium transition-all duration-300 ${
          isScrolled ? 'bg-[#0F111A] shadow-md' : 'bg-transparent'
        }`}
      >
        <a href="/" className="flex items-center gap-2">
          <div className="text-left leading-tight">
            <span className="text-white text-xl font-semibold">XemZui</span><br />
          </div>
        </a>
        <div className="relative hidden md:flex items-center bg-[#1f1f1f2f] rounded-lg px-4 py-2 w-80 ml-6 focus-within:ring-2 focus-within:ring-yellow-400">
          <FaSearch className="text-white mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setTimeout(() => setShowDropdown(false), 100); // Delay tí cho Link hoạt động trước
            }}          
            placeholder="Tìm kiếm phim, diễn viên"
            className="bg-transparent outline-none text-sm text-white flex-grow placeholder:text-gray-400"
          />
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white text-black rounded shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchResults.map((movie) => (
                  <Link
                  to={`/movie/${movie.id}`}
                  key={movie._id}
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setShowDropdown(false);
                    setSearchTerm(''); 
                  }}
                >
                  {movie.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
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

        {/* 📱 App & User */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="hidden md:flex items-center bg-[#2f2f2f] text-white px-4 py-1 gap-2 rounded-full hover:bg-[#3a3a3a]">
            <img src="/vn_flag.svg" alt="" className='size-5'/>
            <div className="text-left text-xs">
              <span className="text-gray-300">Ngôn ngữ</span><br />
              <strong className="text-white text-sm">Tiếng Việt</strong>
            </div>
          </div>

          {isLoggedIn ? (
            <div className="relative group">
              <button className="flex items-center mb-0.5 gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100">
                <FaUserCircle size={20} />
                <span className="text-sm font-medium">Thành viên</span>
              </button>
              <div className="absolute right-0 mt-0 w-40 bg-white text-black rounded shadow-md hidden group-hover:block z-50">
                <Link to="/Profile" className="block px-4 py-2 hover:bg-gray-100">Hồ sơ</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaSignOutAlt size={20}/> Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-white flex gap-2 text-black px-4 py-2 rounded-full text-sm hover:bg-gray-100">
              <FaUserCircle size={20} /> Đăng nhập
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
