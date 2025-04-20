import React, { useState } from "react";

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy",
  36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery",
  10749: "Romance", 878: "Science Fiction", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
};

const YEARS = ["2025", "2024", "2023", "2022", "2021"];
const SORT_OPTIONS = ["Mới nhất", "Cũ nhất", "Tên A-Z", "Tên Z-A"];

export default function MovieFilter({ onFilterChange }) {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [sort, setSort] = useState("Mới nhất");
  
    const toggleValue = (value, setState) => {
      setState((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    };
  
    const handleFilter = () => {
      const filters = {
        genres: selectedGenres,
        years: selectedYears,
        sort,
      };
      onFilterChange(filters);
    };
  
    return (
      <div className="bg-white dark:bg-[#2f2f2f] p-3 rounded-lg shadow-md space-y-3 max-w-[700px] mx-auto">
        {/* Thể loại */}
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
  
        {/* Năm phát hành */}
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
  
        {/* Sắp xếp */}
        <FilterGroup title="Sắp xếp theo">
          {SORT_OPTIONS.map((option) => (
            <FilterButton
              key={option}
              label={option}
              active={sort === option}
              onClick={() => setSort(option)}
            />
          ))}
        </FilterGroup>
  
        {/* Nút lọc */}
        <div className="pt-4 text-center">
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          >
            Lọc phim
          </button>
        </div>
      </div>
    );
  }
  
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
  