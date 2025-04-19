import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";

// Map genre ID sang tên genre
const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      console.log("Fetching movies...");
      try {
        const response = await fetch(`http://localhost:8000/api/movie`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json();
        console.log(data.movies);

        if (data.movies) {
          // ✨ Gắn genres vào từng movie
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

    fetchMovies();
  }, []);

  return (
    <div className="movie-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {error && <div className="text-red-500">Lỗi: {error}</div>}

      {loading ? (
        <div className="text-gray-500">Đang tải danh sách phim...</div>
      ) : movies.length > 0 ? (
        movies.map((movie) => (
          <MovieCard key={movie._id || movie.id} movie={movie} />
        ))
      ) : (
        <div className="text-gray-500">Không có phim nào</div>
      )}
    </div>
  );
}

export default MovieList;
