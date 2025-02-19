const axios = require('axios');

exports.getTracksFromPlaylist = async (req, res) => {
    const accessToken = req.cookies.access_token;
    const playlistId = req.params.playlistId;
    let allSongs = [];

    try {
        let nextURL = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

        while (nextURL) {
            const userPlaylist = await axios(nextURL, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            allSongs = allSongs.concat(userPlaylist.data.items);
            nextURL = userPlaylist.data.next;
        }

        res.json(allSongs);
    } catch (error) {
        console.error('Error fetching playlist tracks:', error.message);
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch playlist tracks' });
    }
}