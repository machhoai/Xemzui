import { refreshAccessToken } from "./RefreshAccessTokenAPI";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

//Đăng xuất
export function HandlerUserLogout(setIsLoggedIn) {
    console.log("HandlerUserLogout: đang yêu cầu đăng xuất");
    
    // Kiểm tra xem setIsLoggedIn có phải là hàm không
    const updateLoggedInState = typeof setIsLoggedIn === 'function' 
        ? setIsLoggedIn 
        : () => console.warn("setIsLoggedIn không phải là hàm");
    
    fetch(`${BASE_URL}/api/logout`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })
    .then((response) => {
        // Sử dụng hàm updateLoggedInState an toàn
        updateLoggedInState(false);
        
        // Không cần đợi response, chuyển hướng ngay
        window.location.href = '/login';
        return null; // Không cần xử lý response.json()
    })
    .catch((error) => {
        console.error("Lỗi khi đăng xuất:", error);
        // Vẫn cố gắng chuyển hướng
        window.location.href = '/login';
    });
}

//Đăng Nhập
export function HandlerUserLogin(email, password, onLogin, setIsAdmin) {
    fetch(`${BASE_URL}/api/login`, {
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
    fetch(`${BASE_URL}/api/getuserinfo`, {
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
    fetch(`${BASE_URL}/api/updateuserinfo`, {
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
    fetch(`${BASE_URL}/api/changepassword`, {
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
    fetch(`${BASE_URL}/api/sendmailtoresetpass`, {
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
    fetch(`${BASE_URL}/api/resetpassword`, {
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

//API lấy thông tin người dùng
export async function HandleGetUser() {
    try {
      const response = await fetch(`${BASE_URL}/api/user`, {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Không thể lấy thông tin người dùng");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
      throw error;
    }
  }