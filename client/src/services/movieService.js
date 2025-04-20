const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const createMovie = async (movie) => {
  const res = await fetch(`${BASE_URL}/api/movies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  });
  if (!res.ok) throw new Error("Tạo phim thất bại");
  return await res.json();
};

export const deleteMovie = async (id) => {
  const res = await fetch(`${BASE_URL}/api/movies/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Xóa phim thất bại");
  return await res.json();
};

export const deleteAllMovie = async () => {
  const res = await fetch(`${BASE_URL}/api/movies`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Xóa phim thất bại");
  return await res.json();
};