const axios = require('axios');

exports.findTrackIdSpotify = async (req, res) => {
    const accessToken = req.cookies.access_token;
    const similarTracks = req.body.similarTracks;

    try {
        //Find track id and preview URL (image) for each track in similarTracks
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

        // Wait for all promises to resolve and find all track IDs and preview URLs
        const trackIdResults = await Promise.all(trackIdPromises);
        const trackIds = trackIdResults.filter(result => result.id !== undefined).map(result => result.id);
        const previewUrls = trackIdResults.filter(result => result.id !== undefined).map(result => result.preview_url);
        const batchSize = 50;
        const trackDetailsPromises = [];

        //Get all track details for all similar tracks in batches of 50 using their IDs
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

        //Remove tracks with popularity less than 10 and map the track details to the desired format for frontend
        const trackInfo = trackDetails
            .filter(track => track.popularity >= 10) 
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