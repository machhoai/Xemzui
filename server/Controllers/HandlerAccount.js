const { UsersCollection } = require("../config/ConnectDB");
const {
  createAccessToken,
  createRefreshToken,
} = require("../middleware/Auth.js");
const { addTokenToBlacklist } = require("../middleware/Blacklist.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function HandlerLogin(req, res) {
  const { email, password } = req.body;

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await UsersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Tài khoản không tồn tại" });
    }

    // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa  trong collection
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    // Tạo access token và refresh token
    const accessToken = createAccessToken(user._id.toString(), user.email, user.isAdmin);
    const refreshToken = createRefreshToken(user._id.toString(), user.email, user.isAdmin);

    //ghi token vào cookie
    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true, // true nếu dùng HTTPS
        sameSite: "None",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Đăng nhập thành công",
        user: { email: user.email, name: user.fullName, isAdmin: user.isAdmin },
      });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
}

async function HandlerSignUp(req, res) {
  const { fullName, email, password } = req.body;
  console.log("HandlerSignUp - body: ", req.body);
  console.log("HandlerSignUp - phoneNumber: ", email);
  console.log("HandlerSignUp - password: ", password);
  console.log("HandlerSignUp - fullName: ", fullName);

  if (!email || email === "" || !password || password === ""
    || !fullName || fullName === "") {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
  }

  try {
    const existingUser = await UsersCollection.findOne({
      email: email,
      fullName: fullName,
    });
    if (existingUser) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      fullName: fullName,
      email: email,
      password: hashedPassword,
      isAdmin: false,
    };

    // Lưu người dùng mới vào cơ sở dữ liệu
    await UsersCollection.insertOne(newUser);

    res.json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Lỗi khi đăng ký người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
}

async function HandlerGetUser(req, res) {
  res.json({
    email: req.user.email,
    isAdmin: req.user.isAdmin,
    name: req.user.name,
  });
}

async function HandlerLogout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).clearCookie("accessToken").json({ message: "Chưa đăng nhập hoặc phiên đăng nhập đã hêt." });
    }
    // Giải mã refresh token để lấy thông tin người dùng
    const decoded = jwt.verify(refreshToken, process.env.SECRET_REFRESH);
    //tính toán thời gian hết hạn của refresh token
    const expiresAt = new Date(decoded.exp * 1000);

    // Thêm refresh token vào danh sách đen
    await addTokenToBlacklist(refreshToken, expiresAt);

    // Xoá cookie refresh token và access token
    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
}

module.exports = { HandlerLogin, HandlerSignUp, HandlerGetUser, HandlerLogout };
