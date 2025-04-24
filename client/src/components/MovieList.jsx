import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { fetchGetGenres, fetchMovies } from "../services/movieService"; // Import fetchMovies
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
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const fetchGenresAndMovies = async () => {
      setLoading(true);
      try {
        const genreList = await fetchGetGenres();
        const map = genreList.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});
        setGenreMap(map);
        
        // Call the external fetchMovies function and handle its response
        const data = await fetchMovies(
          map,
          1, // Reset to first page when filters change
          ITEMS_PER_PAGE,
          searchTerm,
          selectedGenres,
          selectedYears,
          sort
        );
        
        // Process the response data
        handleMoviesResponse(data, map);
        setCurrentPage(1); // Reset current page when filters change
      } catch (err) {
        console.error(err);
        setError("Không thể load thể loại/phim");
      } finally {
        setLoading(false);
        console.log("Đã hoàn thành việc lấy thể loại và phim");
      }
    };

    fetchGenresAndMovies();
  }, [searchTerm, selectedGenres, selectedYears, sort]);

  // Function to handle the response from fetchMovies
  const handleMoviesResponse = (data, genreMapData) => {
    if (data.totalPages >= 0) {
      setTotalPages(data.totalPages);
    }
    if (data.movies) {
      setTotalMovies(data.total);
      const moviesWithGenres = data.movies.map((movie) => ({
        ...movie,
        genres: movie.genre_ids?.map((id) => genreMapData[id]).filter(Boolean),
      }));
      setMovies(moviesWithGenres);
    } else {
      console.error("API không trả về movies");
    }
  };

  const handlePageChange = async (page) => {
    console.log("Đang chuyển trang:", page);
    setLoading(true);
    try {
      const data = await fetchMovies(
        genreMap,
        page,
        ITEMS_PER_PAGE,
        searchTerm,
        selectedGenres,
        selectedYears,
        sort
      );
      handleMoviesResponse(data, genreMap);
      setCurrentPage(page);
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
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
            {movies.map((movie) => (
              <div key={movie._id} className="w-full">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              handlePageChange={handlePageChange}
              pages={totalPages}
              currentPage={currentPage}
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