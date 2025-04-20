import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy",
  36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery",
  10749: "Romance", 878: "Science Fiction", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
};

export default function MovieList({ searchTerm, selectedGenres, selectedYears, sort }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    const filters = {
      genres: selectedGenres.join(","),
      years: selectedYears.join(","),
      sort,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/movies?search=${encodeURIComponent(searchTerm)}&genres=${filters.genres}&years=${filters.years}&sort=${filters.sort}`,
        { method: "GET", headers: { "Content-Type": "application/json" }, credentials: "include" }
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
  }, [searchTerm, selectedGenres, selectedYears, sort]);

  if (loading) {
    return <div className="text-center text-gray-500">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Lỗi: {error}</div>;
  }

  return (
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
  );
}
