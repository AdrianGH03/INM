const axios = require('axios');

exports.findTrackIdSpotify = async (req, res) => {
    const accessToken = req.cookies.access_token;
    const similarTracks = req.body.similarTracks;

    try {
        const trackIdPromises = similarTracks.map(async (track) => {
            let artistName = encodeURIComponent(track.artist);
            let trackName = encodeURIComponent(track.name);

            const response = await axios.get(`https://api.spotify.com/v1/search?q=track:${trackName}%20artist:${artistName}&type=track`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            return {
                id: response.data.tracks.items[0]?.id,
                preview_url: track.preview 
            };
        });

        const trackIdResults = await Promise.all(trackIdPromises);
        const trackIds = trackIdResults.filter(result => result.id !== undefined).map(result => result.id);
        const previewUrls = trackIdResults.filter(result => result.id !== undefined).map(result => result.preview_url);
        const batchSize = 50;
        const trackDetailsPromises = [];

        for (let i = 0; i < trackIds.length; i += batchSize) {
            const batch = trackIds.slice(i, i + batchSize).join(',');
            trackDetailsPromises.push(
                axios.get(`https://api.spotify.com/v1/tracks?ids=${batch}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
            );
        }

        const trackDetailsResponses = await Promise.all(trackDetailsPromises);
        const trackDetails = trackDetailsResponses.flatMap(response => response.data.tracks);

        const trackInfo = trackDetails
            .filter(track => track.popularity >= 10) // Filter out tracks with popularity less than 15
            .map((track, index) => ({
                name: track.name,
                popularity: track.popularity,
                duration_ms: track.duration_ms,
                artist: track.artists[0].name,
                id: track.id,
                images: track.album.images,
                album: track.album.name,
                preview_url: previewUrls[index] 
            }));

        res.json(trackInfo);
    } catch (error) {
        console.error('Error fetching track ids:', error.message);
        res.status(500).json({ error: 'Failed to fetch track ids' });
    }
};