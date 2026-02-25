const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require('../src/routes/auth.routes')
const musicRoutes = require('../src/routes/music.routes')
const cors = require('cors');

const app = express();


app.use(cors({
  origin: true,  
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;