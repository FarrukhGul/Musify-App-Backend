const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require('../src/routes/auth.routes')
const musicRoutes = require('../src/routes/music.routes')

const cors = require('cors')

const app = express();
app.use(express.json())
app.use(cookieParser())



app.use(cors({
  origin: 'http://localhost:5173',  // your React frontend
  credentials: true                  // allows cookies to be sent
}))

app.use('/api/auth', authRoutes)
app.use('/api/music', musicRoutes)

module.exports = app