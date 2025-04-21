import { refreshAccessToken } from "./RefreshAccessTokenAPI";

//Đăng xuất
export function HandlerUserLogout({ setIsLoggedIn }) {
    console.log("HandlerUserLogout: đang ở đây yêu cầu đăng xuất");
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
                console.log('Chưa đăng nhập hoặc phiên đăng nhập đã hêt')
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

            window.alert(data.message);
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
        });
}

//lấy thông tin cá nhân của user
export function HandlerGetUserInfo(setUserInfo, setIsLoggedIn) {
    fetch(`http://localhost:8000/api/getuserinfo`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })
        .then(async (response) => {
            if (response.status === 401) { //access token hết hạn
                await refreshAccessToken(() => { HandlerGetUserInfo(setUserInfo, setIsLoggedIn) }, setIsLoggedIn);
                return;
            }
            return response.json();
        })
        .then((data) => {
            if (!data) return;
            console.log("User info:", data.user);
            setUserInfo(data.user);
        })
        .catch((error) => {
            console.error("Lỗi:", error);
        });
}

//Cập nhật thông tin cá nhân của user
export function HandlerUpdateUserInfo(userInfo) {
    fetch(`http://localhost:8000/api/updateuserinfo`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            fullName: userInfo.name,
            email: userInfo.email,
        }),
    })
        .then(async (response) => {
            if (response.status === 401) { //access token hết hạn
                await refreshAccessToken(() => { HandlerUpdateUserInfo(userInfo) });
                return;
            }
            else if (!response.ok) {
                const errorData = await response.json();
                window.alert(errorData.message || "Cập nhật thông tin thất bại!");
                return;
            }
            return response.json();
        })
        .then((data) => {
            if (!data) return;
            alert(data.message);
        })
        .catch((error) => {
            console.error("Lỗi:", error);
        });
}

//Đổi mật khẩu
export function HandlerChangePassword(oldPassword, newPassword) {
    fetch(`http://localhost:8000/api/changepassword`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            oldPassword,
            newPassword,
        }),
    })
        .then(async (response) => {
            if (response.status === 401) { //access token hết hạn
                await refreshAccessToken(() => { HandlerChangePassword(oldPassword, newPassword) });
                return;
            }
            else if (!response.ok) {
                const errorData = await response.json();
                window.alert(errorData.message || "Đổi mật khẩu thất bại. Vui lòng thử lại!");
                return;
            }
            return response.json();
        })
        .then((data) => {
            if (!data) return;
            alert(data.message);
        })
        .catch((error) => {
            console.error("Lỗi:", error);
        });
}

//gửi link trang reset mật khẩu 
export function HandlerSendLinkResetPassword(email) {
    fetch(`http://localhost:8000/api/sendmailtoresetpass`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
        }),
    })
        .then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                window.alert(errorData.message || "Gửi email reset mật khẩu thất bại. Vui lòng thử lại!");
                return;
            }
            return response.json();
        })
        .then((data) => {
            if (!data) return;
            console.log("message:", data.message);
        })
        .catch((error) => {
            console.error("Lỗi:", error);
        });
}

//reset mật khẩu
export function HandlerResetPassword(token, newPassword, setIsSubmitted) {
    fetch(`http://localhost:8000/api/resetpassword`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token,
            newPassword,
        }),
    })
        .then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                window.alert(errorData.message || "Reset mật khẩu thất bại. Vui lòng thử lại!");
                return;
            }
            return response.json();
        })
        .then((data) => {
            if (!data) return;
            console.log("message:", data.message);
            setIsSubmitted(true);
        })
        .catch((error) => {
            console.error("Lỗi:", error);
        });
}