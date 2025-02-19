const express = require('express');
const router = express.Router();
const { getUserSongs } = require('../../controllers/playlists/getUserSongs.js');
const { getTracksFromPlaylist } = require('../../controllers/tracks/getTracksFromPlaylist.js');

router.get('/getUserSongs', getUserSongs);
router.get('/getPlayListTracks/:playlistId', getTracksFromPlaylist);

module.exports = router;