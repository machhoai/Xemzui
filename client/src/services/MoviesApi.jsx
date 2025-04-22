const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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