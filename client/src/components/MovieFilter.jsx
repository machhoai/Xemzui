import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard"; // Đảm bảo bạn đã import MovieCard

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy",
  36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery",
  10749: "Romance", 878: "Science Fiction", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
};

const YEARS = ["2025", "2024", "2023", "2022", "2021"];
const SORT_OPTIONS = ["Mới nhất", "Cũ nhất", "Tên A-Z", "Tên Z-A"];

export default function MovieFilter() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [sort, setSort] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleValue = (value, setState) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const fetchMovies = async () => {
    const filters = {
      genres: selectedGenres.join(","),
      years: selectedYears.join(","),
      sort,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/movies?genres=${filters.genres}&years=${filters.years}&sort=${filters.sort}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      if (data.movies) {
        const moviesWithGenres = data.movies.map((movie) => ({
          ...movie,
          genres: movie.genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean),
        }));
        setMovies(moviesWithGenres);
      } else {
        console.error("API không trả về movies");
      }
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [selectedGenres, selectedYears, sort]);

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
      </div>

      {/* Khoảng cách giữa bộ lọc và danh sách phim */}
      <div className="my-6"></div>

      {/* Hiển thị phim ra ngoài khung bộ lọc */}
      {loading ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : error ? (
        <div className="text-red-500 text-center">Lỗi: {error}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {movies.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">Không có phim nào</div>
          ) : (
            movies.map((movie) => (
              <div key={movie._id} className="w-full">
                <MovieCard movie={movie} />
              </div>
            ))
          )}
        </div>
      )}
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
