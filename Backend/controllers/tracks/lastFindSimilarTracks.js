const axios = require('axios');
const lastFMApiKey = process.env.LAST_FM_API_KEY;

function shuffleAndReturnOne(arr) {
    let shuffledArr = arr.sort(() => Math.random() - 0.5);
    return shuffledArr[0];
}

exports.lastFindSimilarTracks = async (req, res) => {
    const accessToken = req.cookies.access_token;
    const tracks = req.body.tracks;
    const similarScore = req.body.similarScore;
    let matchingTracks = [];

    if (!accessToken || !tracks || !similarScore) {
        return res.status(401).json({ error: 'Missing parameter for request' });
    }

    for (let track of tracks) {
        let artistName = encodeURIComponent(track.artist);
        let trackName = encodeURIComponent(track.name);

        try {  
            const similarTrack = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${artistName}&track=${trackName}&api_key=${lastFMApiKey}&format=json&limit=50`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const allSimilarTracks = similarTrack.data.similartracks.track;
            const onlyNamesArtistsAndScore = allSimilarTracks.map(track => {
                return { name: track.name, artist: track.artist.name, similarity: track.match };
            });

            const filteredTracks = onlyNamesArtistsAndScore.filter(track => track.similarity >= similarScore);
            const uniqueFilteredTracks = filteredTracks.filter(filteredTrack => 
                !tracks.some(originalTrack => 
                    originalTrack.name === filteredTrack.name && originalTrack.artist === filteredTrack.artist
                )
            );

            if (uniqueFilteredTracks.length > 0) {
                const shuffledTrack = shuffleAndReturnOne(uniqueFilteredTracks);
                if (!matchingTracks.some(matchingTrack => 
                    matchingTrack.name === shuffledTrack.name && matchingTrack.artist === shuffledTrack.artist
                )) {
                    matchingTracks.push(shuffledTrack);
                }
            } else if (filteredTracks.length === 1) {
                if (!matchingTracks.some(matchingTrack => 
                    matchingTrack.name === filteredTracks[0].name && matchingTrack.artist === filteredTracks[0].artist
                )) {
                    matchingTracks.push(filteredTracks[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching similar tracks:', error.message);
            return res.status(500).json({ error: 'Failed to fetch similar tracks' });
        }
    }

    res.json(matchingTracks);
}