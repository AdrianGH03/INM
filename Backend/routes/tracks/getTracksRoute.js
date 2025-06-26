const express = require('express');
const router = express.Router();
const { deezerFindSimilarTracks } = require('../../controllers/tracks/deezerFindSimilarTracks');
const { findTrackIdSpotify } = require('../../controllers/tracks/findTrackIdSpotify');
const { addTrackToPlaylist } = require('../../controllers/tracks/addTrackToPlaylist');
const { removeTrackFromPlaylist } = require('../../controllers/tracks/removeTrackFromPlaylist');


router.post('/findSimilarTracks', deezerFindSimilarTracks);
router.post('/findTrackId', findTrackIdSpotify);
router.post('/addTrack', addTrackToPlaylist);
router.delete('/removeTrack', removeTrackFromPlaylist);

module.exports = router;