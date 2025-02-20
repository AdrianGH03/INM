const axios = require('axios');
const lastFMApiKey = process.env.LAST_FM_API_KEY;

function shuffleAndReturnOne(arr) {
    let shuffledArr = arr.sort(() => Math.random() - 0.5);
    return shuffledArr[0];
}

exports.lastFindSimilarTracks = async (req, res) => {
    const accessToken = req.cookies.access_token;
    const tracks = req.body.tracks;
    let matchingTracks = [];

    if (!accessToken || !tracks) {
        return res.status(401).json({ error: 'Missing parameter for request' });
    }

    for (let track of tracks) {
        let artistName = encodeURIComponent(track.artist);
        let trackName = encodeURIComponent(track.name);

        try {  
            console.log("Going through: " + track.name + " by " + track.artist);
            console.log(`http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${artistName}&track=${trackName}&api_key=${lastFMApiKey}&format=json&limit=50`);
            const similarTrack = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${artistName}&track=${trackName}&api_key=${lastFMApiKey}&format=json&limit=50`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const allSimilarTracks = similarTrack.data.similartracks.track;
            console.log(allSimilarTracks)
            const onlyNamesAndArtists = allSimilarTracks.map(track => {
                return { name: track.name, artist: track.artist.name };
            });

            const uniqueFilteredTracks = onlyNamesAndArtists.filter(filteredTrack => 
                !matchingTracks.some(matchingTrack => 
                    matchingTrack.name === filteredTrack.name && matchingTrack.artist === filteredTrack.artist
                )
            );

            if (uniqueFilteredTracks.length > 0) {
                const shuffledTrack = shuffleAndReturnOne(uniqueFilteredTracks);
                matchingTracks.push(shuffledTrack);
            } else if (onlyNamesAndArtists.length === 1) {
                matchingTracks.push(onlyNamesAndArtists[0]);
            }
        } catch (error) {
            console.error('Error fetching similar tracks:', error.message);
            return res.status(500).json({ error: 'Failed to fetch similar tracks' });
        }
    }

    res.json(matchingTracks);
}