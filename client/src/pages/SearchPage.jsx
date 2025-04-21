import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieList from '../components/MovieList';
import { fetchGetGenres } from '../services/MoviesApi';

const YEARS = ["2025", "2024"];
const SORT_OPTIONS = [
  { label: "Mới nhất", value: "Mới nhất" },
  { label: "Cũ nhất", value: "Cũ nhất" },
  { label: "Tên A-Z", value: "Tên A-Z" },
  { label: "Tên Z-A", value: "Tên Z-A" }
];

const SearchPage = () => {
  const { searchTerm } = useParams();

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedSort, setSelectedSort] = useState('');
  const [genreList, setGenreList] = useState({});
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genres = await fetchGetGenres();
        const genreMap = genres.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});
        setGenreList(genreMap);
      } catch (error) {
        console.error('Lỗi khi lấy genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const toggleValue = (value, setState) => {
    setState(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  return (
    <div id="wrapper" className="pt-20 px-4 md:px-8">
      <h1 style={{ display: 'none' }}>
        Xem Phim {searchTerm} Thuyết Minh, Vietsub HD Online - RoPhim
      </h1>

      <div className="fluid-gap">
        <div className="cards-row wide">
          {/* Tiêu đề */}
          <div className="row-header flex items-center gap-3 mb-4">
            <div className="inc-icon text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40">
                {/* icon SVG */}
              </svg>
            </div>
            <h3 className="category-name text-xl font-bold text-white">
              Kết quả tìm kiếm "{searchTerm}"
            </h3>
          </div>

          {/* Nút hiển thị bộ lọc bên trái */}
          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              {showFilter ? 'Ẩn Bộ Lọc' : 'Hiển Thị Bộ Lọc'}
            </button>
          </div>

          {/* Bộ lọc */}
          {showFilter && (
            <div className="bg-white dark:bg-[#2f2f2f] p-4 rounded-lg shadow-md space-y-3 w-full mb-6">
              <FilterGroup title="Thể loại">
                {Object.entries(genreList).map(([id, name]) => (
                  <FilterButton
                    key={id}
                    label={name}
                    active={selectedGenres.includes(id)}
                    onClick={() => toggleValue(id, setSelectedGenres)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="Năm phát hành">
                {YEARS.map((year) => (
                  <FilterButton
                    key={year}
                    label={year}
                    active={selectedYears.includes(year)}
                    onClick={() => toggleValue(year, setSelectedYears)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="Sắp xếp">
                {SORT_OPTIONS.map((option) => (
                  <FilterButton
                    key={option.value}
                    label={option.label}
                    active={selectedSort === option.value}
                    onClick={() => setSelectedSort(option.value)}
                  />
                ))}
              </FilterGroup>
            </div>
          )}

          {/* Danh sách phim */}
          <MovieList
            searchTerm={searchTerm}
            selectedGenres={selectedGenres}
            selectedYears={selectedYears}
            sort={selectedSort}
          />
        </div>
      </div>
    </div>
  );
};

function FilterGroup({ title, children }) {
  return (
    <div>
      <h4 className="text-gray-800 dark:text-gray-200 font-medium mb-1">{title}</h4>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterButton({ label, active, onClick }) {
  const baseClass = "px-3 py-1 text-sm rounded-full border transition-all";
  const activeClass = "bg-blue-600 text-white border-blue-600";
  const inactiveClass =
    "bg-white dark:bg-[#3a3a3a] text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:border-blue-400";

  return (
    <button onClick={onClick} className={`${baseClass} ${active ? activeClass : inactiveClass}`}>
      {label}
    </button>
  );
}

export default SearchPage;
