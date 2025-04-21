const { UsersCollection } = require("../config/ConnectDB");
const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { createResetPasswordToken } = require("../middleware/Auth.js");

//Lấy thông tin người dùng từ token đã xác thực
async function HandlerGetUserInfor(req, res) {
    const userId = req.user.id; // Lấy ID người dùng từ token đã xác thực
    console.log("HandlerGetUser - userId: ", userId);
    try {
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await UsersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        console.log("HandlerGetUser - user: ", user);
        res.status(200).json({
            message: "Lấy thông tin người dùng thành công",
            user: { email: user.email, name: user.fullName, isAdmin: user.isAdmin },
        });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
}

//Cập nhật thông tin cá nhân của người dùng
async function HandlerUpdateUserInfor(req, res) {
    const userId = req.user.id; // Lấy ID người dùng từ token đã xác thực
    const { fullName, email } = req.body;
    console.log("HandlerUpdateUserInfor - userId: ", userId);
    console.log("HandlerUpdateUserInfor - body: ", req.body);
    try {
        // Cập nhật thông tin người dùng
        const result = await UsersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { fullName: fullName, email: email } }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Người dùng không tồn tại hoặc không có thay đổi nào" });
        }
        res.status(200).json({ message: "Cập nhật thông tin người dùng thành công" });
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin người dùng:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
}

//Đổi mật khẩu của người dùng
async function HandlerChangePassword(req, res) {
    const userId = req.user.id; // Lấy ID người dùng từ token đã xác thực
    const { oldPassword, newPassword } = req.body;
    console.log("HandlerChangePassword - userId: ", userId);
    console.log("HandlerChangePassword - body: ", req.body);
    try {
        // Tìm người dùng trong Collection
        const user = await UsersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // Kiểm tra mật khẩu cũ
        console.log('oldPasss: ', oldPassword)
        console.log('userPass: ', user.password)
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
        }

        // Mã hóa mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới vào Collection
        await UsersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { password: hashedNewPassword } }
        );
        res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
}

// Gửi link reset password qua email
async function HandlerSendResetPasswordLink(req, res) {
    const { email } = req.body;
    console.log("HandlerSendResetPasswordLink - body: ", req.body);
    try {
        // Tìm người dùng trong Collection
        const user = await UsersCollection.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        const token = createResetPasswordToken(user._id, user.email);
        const resetLink = `http://localhost:5173/ResetPassword/${token}`;
        console.log("HandlerSendResetPasswordLink - resetLink: ", resetLink);
        // Gửi email với link reset password
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password',
            text: `Click the link to reset your password: ${resetLink}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Lỗi khi gửi email:", error);
                return res.status(500).json({ message: "Lỗi máy chủ" });
            }
            res.status(200).json({ message: "Email reset password đã được gửi" });
        });
    } catch (error) {
        console.error("Lỗi khi gửi link reset password:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
}

// Xử lý reset password
async function HandlerResetPass(req, res) {
    const { token, newPassword } = req.body;
    console.log("HandlerResetPass - body: ", req.body);
    try {
        // Giải mã token để lấy thông tin người dùng
        const decoded = jwt.verify(token, process.env.SECRET_ACCESS);
        const userId = decoded.id;
        const email = decoded.email;

        // Tìm người dùng trong Collection
        const user = await UsersCollection.findOne({ _id: new ObjectId(userId), email: email });
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // Mã hóa mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới vào Collection
        await UsersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { password: hashedNewPassword } }
        );
        res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
    } catch (error) {
        console.error("Lỗi khi đặt lại mật khẩu:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
}
module.exports = { HandlerGetUserInfor, HandlerUpdateUserInfor, HandlerChangePassword, HandlerSendResetPasswordLink, HandlerResetPass }