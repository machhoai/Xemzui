import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { fetchGetGenres } from "../services/MoviesApi";
import { useLoading } from "../contexts/LoadingContext";
import Pagination from "./Pagination";

export default function MovieList({
  searchTerm,
  selectedGenres,
  selectedYears,
  sort,
}) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const { setLoading } = useLoading();
  const [genreMap, setGenreMap] = useState({});
  const [totalPages, setTotalPages] = useState(1); // Thêm state totalPages
  const [totalMovies, setTotalMovies] = useState(0); // Thêm state totalMovies
  useEffect(() => {
    const fetchGenresAndMovies = async () => {
      setLoading(true);
      try {
        const genreList = await fetchGetGenres(); // Fetch danh sách thể loại
        const map = genreList.reduce((acc, genre) => {
          acc[genre.id] = genre.name; // Tạo GENRE_MAP từ genreList
          return acc;
        }, {});
        setGenreMap(map); // Set GENRE_MAP vào state
        await fetchMovies(map); // Gọi fetchMovies với genreMap mới
      } catch (err) {
        console.error(err);
        setError("Không thể load thể loại/phim");
      } finally {
        setLoading(false); // Chỉ gọi setLoading ở đây
      }
    };

    fetchGenresAndMovies(); // Gọi lại hàm khi các dependency thay đổi
  }, [searchTerm, selectedGenres, selectedYears, sort]); // Các dependency cần theo dõi

  const fetchMovies = async (genreMap, page = 1, limit = 20) => {
    const filters = {
      genres: selectedGenres.join(","),
      years: selectedYears.join(","),
      sort,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/movies?search=${encodeURIComponent(
          searchTerm
        )}&genres=${filters.genres}&years=${filters.years}&sort=${
          filters.sort
        }&page=${page}&limit=${limit}`,
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

      if (data.totalPages >= 0) {
        setTotalPages(data.totalPages); // Cập nhật tổng số trang
      }
      if (data.movies) {
        setTotalMovies(data.total); // Cập nhật tổng số phim
        const moviesWithGenres = data.movies.map((movie) => ({
          ...movie,
          genres: movie.genre_ids?.map((id) => genreMap[id]).filter(Boolean),
        }));
        setMovies(moviesWithGenres);
      } else {
        console.error("API không trả về movies");
      }
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false); // Chỉ gọi setLoading ở đây
    }
  };

  const handlePageChange = (page) => {
    console.log("Đang chuyển trang:", page);
    const limit = 20; // Số lượng phim trên mỗi trang
    setLoading(true); // Bắt đầu loading khi chuyển trang
    fetchMovies(genreMap, page, limit); // Gọi lại hàm fetchMovies với trang mới
  };

  if (error) {
    return <div className="text-center text-red-500">Lỗi: {error}</div>;
  }

  return (
    <>
      {movies.length === 0 && (
        <div className="text-center text-gray-500 col-span-full">
          Không có phim nào
        </div>
      )}
      {movies.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 ">
            {movies.length === 0 ? (
              <div className="text-center text-gray-500 col-span-full">
                Không có phim nào
              </div>
            ) : (
              movies.map((movie) => (
                <div key={movie._id} className="w-full">
                  <MovieCard movie={movie} />
                </div>
              ))
            )}
          </div>
          {totalPages > 1 && (
            <Pagination
              handlePageChange={handlePageChange}
              pages={totalPages}
            />
          )}
          <p className="mt-2 text-white">
            Có {totalMovies} kết quả trùng khớp.
          </p>
        </>
      )}
    </>
  );
}
