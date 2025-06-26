const axios = require('axios');

//Removes a track from a playlist using Spotify API
exports.removeTrackFromPlaylist = async (req, res) => {
    const trackURI = req.body.trackURI;
    const playlistId = req.body.playlistId;
    const accessToken = req.cookies.access_token;
    if (!trackURI || !playlistId || !accessToken) {
        return res.status(401).json({ error: 'Missing parameter for request' });
    }

    try {
        const response = await axios.delete(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
                data: {
                    tracks: [{ uri: `spotify:track:${trackURI}` }]
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            res.status(200).json({ message: 'Track deleted successfully' });
        } else {
            res.status(response.status).json({ error: 'Failed to delete track' });
        }
    } catch (error) {
        console.error('Error removing track from playlist:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}