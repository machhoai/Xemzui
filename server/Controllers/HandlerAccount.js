const { UsersCollection } = require('../config/ConnectDB');
const {createAccessToken, createRefreshToken} = require('../middleware/Auth.js');
const bcrypt = require('bcrypt');

async function HandlerLogin(req, res) {
    const { email, password } = req.body;
    console.log("HandlerLogin - phoneNumber: ", email);
    console.log("HandlerLogin - password: ", password)

    try {
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await UsersCollection.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Tài khoản không tồn tại" });
        }
        // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa trong cơ sở dữ liệu
        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) {
        //     return res.status(401).json({ message: "Mật khẩu không đúng" });
        // }
        // Tạo access token và refresh token
        console.log("HandlerLogin - user: ", user);
        const accessToken = createAccessToken(user.email, user.isAdmin);
        const refreshToken = createRefreshToken(user.email, user.isAdmin);

        res.status(200).json({message: "Đăng nhập thành công", user: { email: user.email, name: user.name }, accessToken, refreshToken });
    } catch (error) {
        console.error("Lỗi khi xác thực người dùng:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
}

module.exports = { HandlerLogin };