const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { runConnect, closeConnection } = require('./config/ConnectDB');
const { authenticate, refreshAccessToken, authenticateAdmin } = require('./middleware/Auth.js');
const { HandlerLogin, HandlerSignUp, HandlerGetUser, HandlerLogout } = require('./Controllers/HandlerAccount.js');
const { getMovieById, getMovies, createMovie, deleteMovie, deleteAllMovie } = require('./Controllers/MoviesController.js');
// const { errorHandler } = require('./middleware/errorMiddleware');
// const {
//   //authenticate,
//   refreshAccessToken,
//   authenticateAdmin,
// } = require("./middleware/Auth.js");
// const {
//   HandlerLogin,
//   HandlerSignUp,
//   HandlerGetUser,
// } = require("./Controllers/HandlerAccount.js");
// const {
//   createMovie,
//   deleteMovie,
//   deleteAllMovie,
//   getMovies,
// } = require("./Controllers/MoviesController.js");
const { errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Chỉ định chính xác client
    credentials: true, // Cho phép gửi cookie/authorization header
  })
);
app.use(cookieParser());
app.use(express.json());

// Ket noi database
runConnect();
// Dong ket noi database khi server ngung hoat dong
closeConnection();

//** API Refresh Token ***/
app.get("/api/refresh-access-token", (req, res) => {
  refreshAccessToken(req, res);
});

//------------- API User-------------------

//** API Account ***/
//API Login
app.post("/api/login", authenticate, (req, res) => HandlerLogin(req, res));

//API SignUp
app.post("/api/signup", (req, res) => HandlerSignUp(req, res));

//API check the login session
app.get("/api/user", authenticate, (req, res) => HandlerGetUser(req, res));

// API Logout
app.get("/api/logout", (req, res) => HandlerLogout(req, res));

// API get user infor
app.get("/api/getuserinfo/:id", authenticate, (req, res) => HandlerGetUser(req, res));

//** API Handler Data Movies ***/
app.get('/api/get-movie-detail/:id', (req, res) => {
    const movieId = req.params.id;
    getMovieById(req, res, movieId)
})

//------------- API Admin -----------------
//API Create Movie
app.post("/api/movies", authenticateAdmin, (req, res) => createMovie(req, res));

//API Delete Movie
app.delete("/api/movies/:id", authenticateAdmin, (req, res) =>
  deleteMovie(req, res)
);

//API Delete Many Movie
app.delete("/api/movies", authenticateAdmin, (req, res) =>
  deleteAllMovie(req, res)
);

app.get('/api/movie', (req, res) => {
  console.log("hjddhfkjdfh");
  getMovies(req, res)
})



// xử lí lỗi middleware ---> luôn đặt ở cuối trước các router để throw lỗi json
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
  console.log(`Máy chủ đang chạy trên cổng này http://localhost:${PORT}`)
);
