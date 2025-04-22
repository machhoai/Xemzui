const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { runConnect, closeConnection } = require('./config/ConnectDB');
const { authenticate, refreshAccessToken, authenticateAdmin } = require('./middleware/Auth.js');
const { HandlerLogin, HandlerSignUp, HandlerGetUser, HandlerLogout } = require('./Controllers/HandlerAccount.js');
const { getMovieById, getMovies, getGenresList, createMovie, deleteMovie, deleteAllMovie, updateMovie } = require('./Controllers/MoviesController.js');
const { HandlerGetUserInfor, HandlerUpdateUserInfor, HandlerChangePassword, HandlerSendResetPasswordLink, HandlerResetPass } = require('./Controllers/HandlerUserData.js');

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "https://xemzui.vercel.app", // Chỉ định chính xác client
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
app.post("/api/login", (req, res) => HandlerLogin(req, res));

//API SignUp
app.post("/api/signup", (req, res) => HandlerSignUp(req, res));

//API check the login session
app.get("/api/user", authenticate, (req, res) => HandlerGetUser(req, res));

// API Logout
app.get("/api/logout", (req, res) => HandlerLogout(req, res));

// API get user infor
app.get("/api/getuserinfo", authenticate, (req, res) => HandlerGetUserInfor(req, res));

// API update user infor
app.put("/api/updateuserinfo", authenticate, (req, res) => HandlerUpdateUserInfor(req, res));

// API change password
app.put("/api/changepassword", authenticate, (req, res) => HandlerChangePassword(req, res));

// API send mail to reset password
app.post("/api/sendmailtoresetpass", (req, res) => HandlerSendResetPasswordLink(req, res));

// API reset password
app.post("/api/resetpassword", (req, res) =>HandlerResetPass(req, res));

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

app.put("/api/movies/:id", authenticateAdmin, (req, res) => updateMovie(req, res));

app.get('/api/movie', (req, res) => {
  getMovies(req, res)
})

app.get("/api/movies", (req, res) => {
  const { genres, years, sort,search } = req.query;
 getMovies(req, res, genres, years, sort, search)
});

app.get("/api/getGenres", (req, res) => {
  getGenresList(req, res)
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
  console.log(`Máy chủ đang chạy trên cổng này http://localhost:${PORT}`)
);
