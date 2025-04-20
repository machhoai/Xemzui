import React, { useEffect, useState } from 'react';
import MovieList from './MovieList';  // Import MovieList
import { fetchGetGenres } from '../services/MoviesApi'; // Import API function

const YEARS = ["2025", "2024"];

const MovieFilter = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [genreList, setGenreList] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await fetchGetGenres(); // Fetch danh sách thể loại
        const map = genreList.reduce((acc, genre) => {
          acc[genre.id] = genre.name; // Tạo GENRE_MAP từ genreList
          return acc;
        }, {});
        setGenreList(map);
      } catch (error) {
        console.error("Lỗi khi fetch genres:", error);
      }
    };
  
    fetchGenres();
  }, []);

  const toggleValue = (value, setState) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className=" mx-auto">
      {/* Bộ lọc */}
      <div className="bg-white dark:bg-[#2f2f2f] p-3 rounded-lg shadow-md space-y-3 w-1/3 mx-auto mb-6">
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
      </div>
      {/* Danh sách phim với bộ lọc */}
      <div className='flex flex-col items-center'>
        <MovieList
          searchTerm=""
          selectedGenres={selectedGenres}
          selectedYears={selectedYears}
        />
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

export default MovieFilter;
