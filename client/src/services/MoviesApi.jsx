export async function fetchMovieDetail(id) {
    try {
        const response = await fetch(`http://localhost:8000/api/get-movie-detail/${id}`,
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