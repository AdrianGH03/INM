const express = require('express');
const router = express.Router();
const { lastFindSimilarTracks } = require('../../controllers/tracks/lastFindSimilarTracks');

router.post('/findSimilarTracks', lastFindSimilarTracks);

module.exports = router;