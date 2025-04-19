import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";

function MovieList() {
  const [movies, setMovies] = useState([]); // State để lưu danh sách phim
  const [loading, setLoading] = useState(true); // State để kiểm tra trạng thái loading
  const [error, setError] = useState(null); // State để lưu lỗi nếu có

  // Fetch movies từ API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        // Kiểm tra xem response có ok không
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json();
        console.log("Dữ liệu trả về từ API:", data.movies);

        if (data.movies) {
          setMovies(data.movies); // Cập nhật danh sách phim
        } else {
          console.error("API không trả về movies");
        }
      } catch (error) {
        setError(error.message); // Lưu thông báo lỗi vào state
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="movie-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Nếu có lỗi, hiển thị thông báo lỗi */}
      {error && <div className="text-red-500">Lỗi: {error}</div>}

      {/* Nếu đang loading, hiển thị thông báo đang tải */}
      {loading ? (
        <div className="text-gray-500">Đang tải danh sách phim...</div>
      ) : (
        // Nếu không có lỗi và không đang tải, hiển thị danh sách phim
        movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard key={movie._id || movie.id} movie={movie} />
          ))
        ) : (
          <div className="text-gray-500">Không có phim nào</div>
        )
      )}
    </div>
  );
}

export default MovieList;
