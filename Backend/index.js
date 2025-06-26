const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;
const authorizeUserRoute = require('./routes/authentication/authorizeUserRoute');
const playlistRoute = require('./routes/playlists/playlistRoute');
const tracksRoute = require('./routes/tracks/getTracksRoute');
const checkAndRefreshToken = require('./middleware/checkAccessToken');

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: process.env.CORS_ORIGINS,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: [
    'X-CSRF-Token', 
    'X-Requested-With', 
    'Accept', 
    'Accept-Version', 
    'Content-Length', 
    'Content-MD5', 
    'Content-Type', 
    'Date', 
    'X-Api-Version',
    'x-server-token',
    'x-server-secret',
    'Access-Control-Allow-Origin',
  ],
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use('/', authorizeUserRoute);
app.use('/playlists', checkAndRefreshToken, playlistRoute);
app.use('/tracks', checkAndRefreshToken, tracksRoute);

app.get('/', (req, res) => {
  res.send('Working');
});

app.listen(port, () => {
    console.log(`Server is running`);
});

module.exports = app;
