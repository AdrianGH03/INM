const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;
const authorizeUserRoute = require('./routes/authentication/authorizeUserRoute');
const playlistRoute = require('./routes/playlists/playlistRoute');
const tracksRoute = require('./routes/tracks/getTracksRoute');
const validateAccessToken = require('./middleware/checkAccessToken');

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/', authorizeUserRoute);
app.use('/playlists', validateAccessToken, playlistRoute);
app.use('/tracks', validateAccessToken, tracksRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});