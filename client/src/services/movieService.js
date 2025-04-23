const BASE_URL = import.meta.env.VITE_BACKEND_URL;

//API tạo phim
export const createMovie = async (movie) => {
  try {
    const res = await fetch(`${BASE_URL}/api/movies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(movie),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Chi tiết lỗi:", errorData);
      throw new Error(`Tạo phim thất bại: ${errorData.message || res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    throw error;
  }
};

//API update phim
export const updateMovie = async (id, movieData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/movies/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}` // Add auth header
      },
      credentials: 'include',
      body: JSON.stringify(movieData),
    });

    console.log(JSON.stringify(movieData)); // Log the response status
    

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update movie: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Update movie error:", error);
    throw error;
  }
}

//API xóa phim
export const deleteMovie = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/api/movies/${id}`, {
      method: "DELETE",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Chi tiết lỗi:", errorData);
      throw new Error(`Xóa phim thất bại: ${errorData.message || res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    throw error;
  }
};

//API xóa tất cả phim
export const deleteAllMovie = async () => {
  const res = await fetch(`${BASE_URL}/api/movies`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Xóa phim thất bại");
  return await res.json();
};

//API lấy danh sách phim
export const fetchMovies = async (
  genreMap,
  page = 1,
  limit = 20,
  searchTerm = "",
  selectedGenres = [],
  selectedYears = [],
  sort = "newest"
) => {
  const filters = {
    genres: Array.isArray(selectedGenres) ? selectedGenres.join(",") : "",
    years: Array.isArray(selectedYears) ? selectedYears.join(",") : "",
    sort,
  };

  try {
    const response = await fetch(
      `${BASE_URL}/api/movies?search=${encodeURIComponent(
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

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    throw error;
  }
};

//API lay danh sách phim theo id
export const fetchMovieById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/get-movie-detail/${id}`, {
    method: "GET",
    credentials: 'include',
  });
  if (!res.ok) throw new Error("Lấy phim thất bại");
  return await res.json();
}

//API lay danh sách phim chi tiết
export async function fetchMovieDetail(id) {
    try {
        const response = await fetch(`${BASE_URL}/api/get-movie-detail/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch movie detail");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching movie detail:", error);
        return null;
    }
}

//API lấy thể loại phim
export async function fetchGetGenres() {
    try {
        const response = await fetch(`${BASE_URL}/api/getGenres`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch movies by genre");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching movies by genre:", error);
        return null;
    }
}