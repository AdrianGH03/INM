const axios = require('axios');

//Take playlist id and track URI from request body and add track to playlist
exports.addTrackToPlaylist = async (req, res) => {
    const trackURI = req.body.trackURI;
    const playlistId = req.body.playlistId;
    const accessToken = req.cookies.access_token;
    if (!trackURI || !playlistId || !accessToken) {
        return res.status(401).json({ error: 'Missing parameter for request' });
    }

    try {
        const response = await axios.post(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            { uris: [`spotify:track:${trackURI}`] },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 201) {
            res.status(201).json({ message: 'Track added successfully' });
        } else {
            res.status(response.status).json({ error: 'Failed to add track' });
        }
    } catch (error) {
        console.error('Error adding track to playlist:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }

    
}

