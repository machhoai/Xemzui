const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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

export const deleteAllMovie = async () => {
  const res = await fetch(`${BASE_URL}/api/movies`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Xóa phim thất bại");
  return await res.json();
};

export const fetchMovieById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/get-movie-detail/${id}`, {
    method: "GET",
    credentials: 'include',
  });
  if (!res.ok) throw new Error("Lấy phim thất bại");
  return await res.json();
}

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
