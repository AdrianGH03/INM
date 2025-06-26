const axios = require('axios');

function shuffleAndReturnOne(arr) {
    let shuffledArr = arr.sort(() => Math.random() - 0.5);
    return shuffledArr[0];
}

//Delay for requests to avoid hitting rate limits
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Takes users tracks and finds similar tracks using Deezer API
exports.deezerFindSimilarTracks = async (req, res) => {
    const tracks = req.body.tracks;
    let matchingTracks = [];
    const maxTracks = tracks.length; 
    const maxRequestsPerBatch = 500; //Deezer's rate limit
    const delayBetweenBatches = 0;

    if (!tracks) {
        return res.status(401).json({ error: 'Missing parameter for request' });
    }
    let requestCount = 0;

    //Do the following for each track in the users tracks
    for (let i = 0; i < tracks.length; i++) {
        if (matchingTracks.length >= maxTracks) {
            break;
        }

        let track = tracks[i];
        let artistName = encodeURIComponent(track.artist);
        let trackName = encodeURIComponent(track.name);

        try {
            //Get the track from Deezer using the artist and track name
            const searchResponse = await axios.get(`https://api.deezer.com/search?q=artist:"${artistName}"track:"${trackName}"`);

            requestCount++;
            if (requestCount >= maxRequestsPerBatch) {
                await delay(delayBetweenBatches);
                requestCount = 0;
            }

            if (searchResponse.data.data.length === 0) {
                continue;
            }

            const trackData = searchResponse.data.data[0];
            const artistId = trackData.artist.id;

            //Get related artists using the artist ID
            const relatedArtistsResponse = await axios.get(`https://api.deezer.com/artist/${artistId}/related`);

            requestCount++;
            if (requestCount >= maxRequestsPerBatch) {
                await delay(delayBetweenBatches);
                requestCount = 0;
            }

            //Sort the related artists by number of fans and select one
            let relatedArtists = relatedArtistsResponse.data.data;
            if (relatedArtists.length === 0) {
                continue;
            }
            relatedArtists = relatedArtists.sort((a, b) => b.nb_fan - a.nb_fan);

            let selectedArtist;
            if (relatedArtists.length >= 5) {
                selectedArtist = shuffleAndReturnOne(relatedArtists.slice(0, 5));
            }
            else if (relatedArtists.length >= 4) {
                selectedArtist = shuffleAndReturnOne(relatedArtists.slice(0, 4));
            }
            else if (relatedArtists.length >= 3) {
                selectedArtist = shuffleAndReturnOne(relatedArtists.slice(0, 3));
            }
            else if (relatedArtists.length >= 2) {
                selectedArtist = shuffleAndReturnOne(relatedArtists.slice(0, 2));
            } else {
                selectedArtist = relatedArtists[0];
            }

            //Get the radio tracks of the selected artist, and filter out tracks that are already in the user's tracks or matching tracks
            let uniqueRadioTracks = [];
            while (uniqueRadioTracks.length === 0) {
                const radioResponse = await axios.get(`https://api.deezer.com/artist/${selectedArtist.id}/radio`);

                requestCount++;
                if (requestCount >= maxRequestsPerBatch) {
                    await delay(delayBetweenBatches);
                    requestCount = 0;
                }

                const radioTracks = radioResponse.data.data;

                uniqueRadioTracks = radioTracks.filter(radioTrack => 
                    !tracks.some(t => t.name === radioTrack.title && t.artist === radioTrack.artist.name) &&
                    !matchingTracks.some(t => t.name === radioTrack.title && t.artist === radioTrack.artist.name)
                );

                if (uniqueRadioTracks.length === 0) {
                    selectedArtist = shuffleAndReturnOne(relatedArtists);
                }
            }


            //After successfully getting unique radio tracks, select one track and add it to the matching tracks
            const selectedTrack = shuffleAndReturnOne(uniqueRadioTracks);

            matchingTracks.push({
                name: selectedTrack.title,
                artist: selectedTrack.artist.name,
                preview: selectedTrack.preview,
                relatedArtistSource: artistName
            });

        } catch (error) {
            if (error.response && error.response.status === 403) {
                continue;
            }
            console.log(error)
            console.error('Error fetching similar tracks:', error.message, error.response ? error.response.data : '');
            return res.status(500).json({ error: 'Failed to fetch similar tracks' });
        }
    }
    res.json(matchingTracks);
}