const express = require('express');
const router = express.Router();
const { lastFindSimilarTracks } = require('../../controllers/tracks/lastFindSimilarTracks');
const { findTrackIdSpotify } = require('../../controllers/tracks/findTrackIdSpotify');

router.post('/findSimilarTracks', lastFindSimilarTracks);
router.post('/findTrackId', findTrackIdSpotify);

module.exports = router;