const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require('../src/routes/auth.routes')
const musicRoutes = require('../src/routes/music.routes')
const cors = require('cors');

const app = express();


const allowedOrigins = [
  'http://localhost:5173',
  'https://musify-app-frontend.vercel.app',
  'https://musify-app-frontend-9aq25vmfo-farrukhs-projects-2b8a84ac.vercel.app' 
];

app.use(cors({
  origin: function (origin, callback) {
 
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;