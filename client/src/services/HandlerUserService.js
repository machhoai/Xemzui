import { refreshAccessToken } from "./RefreshAccessTokenAPI";
var userid = null;
//Đăng xuất
export function HandlerUserLogout({ setIsLoggedIn }) {
    fetch("http://localhost:8000/api/logout", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })
        .then((response) => {
            if (response.status == 400) {
                setIsLoggedIn(false);
                window.location.href = '/login';
                return;
            }
            else if (!response.ok) {
                alert("Lỗi khi đăng xuất. Vui lòng thử lại sau!");
                return;
            }
            return response.json();
        })
        .then((data) => {
            if (!data) return;

            alert(data.message);
            setIsLoggedIn(false);
            window.location.href = '/login';
        })
        .catch((error) => {
            console.error("Lỗi:", error);
            alert("Đăng xuất không thành công!");
        });
}

//Đăng Nhập
export function HandlerUserLogin(email, password, onLogin, setIsAdmin) {
    fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    })
        .then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                window.alert(errorData.message || "Đăng nhập thất bại!");
                return;
            }
            return response.json();
        })
        .then((data) => {
            if (!data) return;
            onLogin(); //chuyển trạng thái đăng nhập
            console.log("isAdmin:", data.user.isAdmin);
            userid = data.user._id;
            if (data.user.isAdmin) {
                setIsAdmin(true);
                window.location.href = '/admin';
            }
            else {
                window.location.href = '/';
            }
        })
        .catch((error) => {
            console.error("Lỗi:", error);
            alert("thông báo", error.message,
                [
                    {
                        text: "OK",
                        onPress: () => { },
                        style: "cancel",
                    },
                ],
                { cancelable: false }
            );
        });
}

//lấy thông tin cá nhân của user
export function HandlerGetUserInfo(setUserInfo, setIsLoggedIn) {
    fetch(`http://localhost:8000/api/getuserinfo/${userid}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })
        .then(async (response) => {
            if (response.status === 401) { //access token hết hạn
                refreshAccessToken(() => { HandlerGetUserInfo(setUserInfo, setIsLoggedIn) }, setIsLoggedIn);
                return;
            }
            return response.json();
        })
        .then((data) => {
            if (!data) return;
            setUserInfo(data.user);
        })
        .catch((error) => {
            console.error("Lỗi:", error);
        });
}