import React, { useState } from 'react';
import MovieList from './MovieList';  // Import MovieList

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy",
  36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery",
  10749: "Romance", 878: "Science Fiction", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
};

const YEARS = ["2025", "2024", "2023", "2022", "2021"];

const MovieFilter = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  const toggleValue = (value, setState) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Bộ lọc */}
      <div className="bg-white dark:bg-[#2f2f2f] p-3 rounded-lg shadow-md space-y-3 w-1/3 mx-auto">
        <FilterGroup title="Thể loại">
          {Object.entries(GENRE_MAP).map(([id, name]) => (
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

      {/* Khoảng cách giữa bộ lọc và danh sách phim */}
      <div className="my-6"></div> {/* Thêm margin cho khoảng cách */}

      {/* Danh sách phim với bộ lọc */}
      <MovieList
        searchTerm=""
        selectedGenres={selectedGenres}
        selectedYears={selectedYears}
      />
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
