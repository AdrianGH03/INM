const axios = require('axios');

exports.getTracksFromPlaylist = async (req, res) => {
    const accessToken = req.cookies.access_token;
    const playlistId = req.params.playlistId;
    let allSongs = [];
    let artistIds = new Set();

    try {
        let nextURL = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

        // Fetch all tracks from the playlist in a while loop (multiple requests) as spotify only returns 100 tracks at a time
        while (nextURL) {
            const userPlaylist = await axios(nextURL, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            // Check if the response contains items and add them to allSongs
            userPlaylist.data.items.forEach(item => {
                if (item.track && item.track.artists) {
                    allSongs.push(item);
                    item.track.artists.forEach(artist => {
                        artistIds.add(artist.id);
                    });
                }
            });

            nextURL = userPlaylist.data.next;
        }

        // Fetch artist details in batches of 50 to avoid hitting the API limit
        artistIds = Array.from(artistIds);
        const artistDetails = {};
        const batchSize = 50;
        for (let i = 0; i < artistIds.length; i += batchSize) {
            const batch = artistIds.slice(i, i + batchSize);
            const artistResponse = await axios.get(`https://api.spotify.com/v1/artists?ids=${batch.join(',')}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            artistResponse.data.artists.forEach(artist => {
                artistDetails[artist.id] = artist.genres;
            });
        }

        //Add genres to each track for filtering on frontend
        allSongs.forEach(item => {
            item.track.artists.forEach(artist => {
                artist.genres = artistDetails[artist.id] || [];
            });
        });

        res.json(allSongs);
    } catch (error) {
        console.error('Error fetching playlist tracks:', error.message);
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch playlist tracks' });
    }
}