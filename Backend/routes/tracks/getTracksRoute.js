const express = require('express');
const router = express.Router();
const { deezerFindSimilarTracks } = require('../../controllers/tracks/deezerFindSimilarTracks');
const { findTrackIdSpotify } = require('../../controllers/tracks/findTrackIdSpotify');

router.post('/findSimilarTracks', deezerFindSimilarTracks);
router.post('/findTrackId', findTrackIdSpotify);

module.exports = router;