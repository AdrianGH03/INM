const axios = require('axios');

//Gets user playlists, top tracks, and top artists from Spotify API
exports.getUserSongs = async (req, res) => {
    const accessToken = req.cookies.access_token
    const userSongs = {}

    try {
        const userPlaylists = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        const userTopTracks = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        const userTopArtists = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        userSongs.playlists = userPlaylists.data.items
        userSongs.topTracks = userTopTracks.data.items
        userSongs.topArtists = userTopArtists.data.items
        

        res.json(userSongs);
    } catch (error) {
        console.error('Error fetching user playlists:', error.message);
        res.status(500).json({ error: 'Failed to fetch user playlists' });
    }
}