import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaCaretDown,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { HandlerUserLogout } from "../services/HandlerUserService";
import { useNavigate } from "react-router-dom";
import { fetchMovies } from "../services/movieService"; // Import hàm fetchMovies

const Header = (isLoggedIn, setIsLoggedIn) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [genreMap, setGenreMap] = useState({}); // Thêm state cho genreMap

  // Khởi tạo genreMap (có thể đặt ở component cha và truyền xuống)
  useEffect(() => {
    // Fetch thể loại nếu cần
    // Ví dụ: fetchGenres().then(genres => setGenreMap(genres));

    // Hoặc tạo một genreMap rỗng nếu không cần map thể loại trong header
    setGenreMap({});
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      // Sử dụng hàm fetchMovies từ service
      const data = await fetchMovies(
        genreMap, // genreMap
        1, // page
        5, // limit (giới hạn kết quả tìm kiếm ở header)
        searchTerm, // searchTerm
        [], // selectedGenres (để trống vì không lọc thể loại)
        [], // selectedYears (để trống vì không lọc năm)
        "relevance" // sort (sắp xếp theo độ liên quan)
      );

      setSearchResults(data.movies || []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Lỗi tìm kiếm phim:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
          isScrolled ? "bg-[#0F111A] shadow-md" : "bg-transparent"
        }`}
      >
        <a href="/" className="flex items-center gap-2">
          <div className="leading-tight text-left">
            <span className="text-xl font-semibold text-white">XemZui</span>
            <br />
          </div>
        </a>
        <div className="relative hidden md:flex items-center bg-[#1f1f1f2f] rounded-lg px-4 py-2 w-80 ml-6 focus-within:ring-2 focus-within:ring-yellow-400">
          <FaSearch className="mr-2 text-white" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setTimeout(() => setShowDropdown(false), 100); // Delay tí cho Link hoạt động trước
            }}
            placeholder="Tìm kiếm phim, diễn viên"
            className="flex-grow text-sm text-white bg-transparent outline-none placeholder:text-gray-400"
          />
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 z-50 w-full mt-2 overflow-y-auto text-black bg-white rounded shadow-lg top-full max-h-80">
              {searchResults.map((movie) => (
                <Link
                  to={`/movie/${movie.id}`}
                  key={movie._id || movie.id} // Sử dụng movie.id làm backup nếu _id không tồn tại
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setShowDropdown(false);
                    setSearchTerm("");
                  }}
                >
                  {movie.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="items-center hidden gap-6 mx-8 text-sm text-white lg:flex">
          <Link to="/chu-de" className="hover:text-yellow-400">
            Chủ Đề
          </Link>
          <Link to="/duyet-tim" className="hover:text-yellow-400">
            Duyệt tìm
          </Link>
          <Link to="/phim-le" className="hover:text-yellow-400">
            Phim Lẻ
          </Link>
          <Link to="/phim-bo" className="hover:text-yellow-400">
            Phim Bộ
          </Link>
          <div className="relative group">
            <span className="flex items-center cursor-pointer hover:text-yellow-400">
              Quốc gia <FaCaretDown className="ml-1 text-xs" />
            </span>
            <div className="absolute z-50 hidden w-40 mt-2 text-black bg-white rounded shadow-lg group-hover:block">
              <Link
                to="/quoc-gia/vn"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Việt Nam
              </Link>
              <Link
                to="/quoc-gia/us"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Mỹ
              </Link>
              <Link
                to="/quoc-gia/kr"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Hàn Quốc
              </Link>
            </div>
          </div>
          <Link to="/dien-vien" className="hover:text-yellow-400">
            Diễn Viên
          </Link>
          <Link to="/lich-chieu" className="hover:text-yellow-400">
            Lịch chiếu
          </Link>
        </nav>

        {/* 📱 App & User */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="hidden md:flex items-center bg-[#2f2f2f] text-white px-4 py-1 gap-2 rounded-full hover:bg-[#3a3a3a]">
            <img src="/vn_flag.svg" alt="" className="size-5" />
            <div className="text-xs text-left">
              <span className="text-gray-300">Ngôn ngữ</span>
              <br />
              <strong className="text-sm text-white">Tiếng Việt</strong>
            </div>
          </div>

          {isLoggedIn ? (
            <div className="relative group">
              <button className="flex items-center mb-0.5 gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100">
                <FaUserCircle size={20} />
                <span className="text-sm font-medium">Thành viên</span>
              </button>
              <div className="absolute right-0 z-50 hidden w-40 mt-0 text-black bg-white rounded shadow-md group-hover:block">
                <Link
                  to="/Profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Hồ sơ
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-2 px-4 py-2 text-left hover:bg-gray-100"
                >
                  <FaSignOutAlt size={20} /> Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex gap-2 px-4 py-2 text-sm text-black bg-white rounded-full hover:bg-gray-100"
            >
              <FaUserCircle size={20} /> Đăng nhập
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
