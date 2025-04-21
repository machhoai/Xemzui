//API refresh access token
export async function refreshAccessToken(callback = () => { }, setIsLoggedIn) {
    fetch("http://localhost:8000/api/refresh-access-token", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })
    .then(async (response) => {
        if (response.status === 402) { //user chưa đăng nhập hoặc refresh token hết hạn
            console.log("refreshAccessToken: lỗi 402 tôi đang ở đây yêu câu đăng nhập lại");
            setIsLoggedIn(false);
            return;
        }
        return response.json();
    })
    .then(async (data) => {
        if (!data) return;
        return callback();
    })
    .catch(error => {
        console.error('Error refreshing access token:', error);
    });
}