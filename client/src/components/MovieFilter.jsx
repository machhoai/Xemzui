import React, { useEffect, useState } from 'react';
import MovieList from './MovieList';
import { fetchGetGenres } from '../services/movieService';
import { useSearchParams } from 'react-router-dom';

const YEARS = ["2025", "2024"];
const SORT_OPTIONS = [
  { label: "Mới nhất", value: "Mới nhất" },
  { label: "Cũ nhất", value: "Cũ nhất" },
  { label: "Tên A-Z", value: "Tên A-Z" },
  { label: "Tên Z-A", value: "Tên Z-A" }
];

const MovieFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGenres, setSelectedGenres] = useState(() => searchParams.getAll('genres'));
  const [selectedYears, setSelectedYears] = useState(() => searchParams.getAll('years'));
  const [selectedSort, setSelectedSort] = useState(() => searchParams.get('sort') || "");
  const [genreList, setGenreList] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genres = await fetchGetGenres();
        const map = genres.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});
        setGenreList(map);
      } catch (error) {
        console.error("Lỗi khi fetch genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const updateSearchParams = (key, values) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    values.forEach((v) => newParams.append(key, v));
    setSearchParams(newParams);
  };

  const toggleValue = (value, values, setState, key) => {
    const updated = values.includes(value)
      ? values.filter((v) => v !== value)
      : [...values, value];

    setState(updated);
    updateSearchParams(key, updated);
  };

  const handleSortChange = (value) => {
    setSelectedSort(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    setSearchParams(newParams);
  };

  return (
    <div className="mx-auto">
      <div className="bg-white dark:bg-[#2f2f2f] p-3 rounded-lg shadow-md space-y-3 w-1/3 mx-auto mb-6">
        <FilterGroup title="Thể loại">
          {Object.entries(genreList).map(([id, name]) => (
            <FilterButton
              key={id}
              label={name}
              active={selectedGenres.includes(id)}
              onClick={() => toggleValue(id, selectedGenres, setSelectedGenres, 'genres')}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Năm phát hành">
          {YEARS.map((year) => (
            <FilterButton
              key={year}
              label={year}
              active={selectedYears.includes(year)}
              onClick={() => toggleValue(year, selectedYears, setSelectedYears, 'years')}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Sắp xếp">
          {SORT_OPTIONS.map((option) => (
            <FilterButton
              key={option.value}
              label={option.label}
              active={selectedSort === option.value}
              onClick={() => handleSortChange(option.value)}
            />
          ))}
        </FilterGroup>
      </div>

      <div className="flex flex-col items-center">
        <MovieList
          searchTerm=""
          selectedGenres={selectedGenres}
          selectedYears={selectedYears}
          sort={selectedSort}
        />
      </div>
    </div>
  );
};

function FilterGroup({ title, children }) {
  return (
    <div>
      <h4 className="mb-1 font-medium text-gray-800 dark:text-gray-200">{title}</h4>
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
