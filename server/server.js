const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv');
const { runConnect, closeConnection } = require('./config/ConnectDB');
const { authenticate, refreshAccessToken } = require('./middleware/Auth.js');
const { HandlerLogin } = require('./Controllers/HandlerAccount.js');
// const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express()
app.use(cors())
app.use(express.json())

// Ket noi database
runConnect();
// Dong ket noi database khi server ngung hoat dong
closeConnection();

//** API Refresh Token ***/
app.post('/refresh-token', (req, res) => { refreshAccessToken(req.body.refreshToken, res) });

//------------- API User-------------------

//** API Account ***/
//API Login
app.post('/api/login', authenticate, (req, res) => HandlerLogin(req, res))

//** API Handler Data Movies ***/



//------------- API Admin -----------------


// xử lí lỗi middleware ---> luôn đặt ở cuối trước các router để throw lỗi json
// app.use(errorHandler)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Máy chủ đang chạy trên cổng này http://localhost:${PORT}`))