import { useEffect, useRef } from 'react';

function SimilarTracks({ tracksShow, setTrackIds, trackIds, trackIdsShow, setTrackIdsShow }) {
    const audioRefs = useRef([]);

    useEffect(() => {
        if (trackIds.length > 0) {
            const trackIdsShow = trackIds.map((track, index) => {
                return (
                    <div key={`${track.id}-${index}`} className='track'>
                        <img src={track.images[0].url} alt={track.name} 
                            style={{ width: '100px', height: '100px' }}
                        />
                        <div>
                            <h3>{track.name}</h3>
                            <p>{track.artist}</p>
                            <p>Popularity: {track.popularity}</p>
                            {track.preview_url && (
                                <audio
                                    controls
                                    className='audio'
                                    ref={el => audioRefs.current[index] = el}
                                >
                                    <source src={track.preview_url} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </div>
                    </div>
                )
            });
            setTrackIdsShow(trackIdsShow);
        } else {
            setTrackIdsShow(null);
        }
    }, [trackIds, setTrackIdsShow]);

    useEffect(() => {
        audioRefs.current.forEach(audio => {
            if (audio) {
                audio.volume = 0.5;
            }
        });
    }, [trackIdsShow]);

    const handleGetSimilarTracks = () => {
        if (tracksShow && tracksShow.length > 0) {
            const onlyNamesAndArtists = tracksShow.map(track => {
                return { name: track.props.children[1].props.children[0].props.children, artist: track.props.children[1].props.children[1].props.children };
            });
            setTrackIds([]);
            const getSimilarTracks = async (tracks) => {
                try {
                    const response = await fetch('http://localhost:5000/tracks/findSimilarTracks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ tracks: onlyNamesAndArtists }),
                        credentials: 'include'
                    });
                    const data = await response.json();
                    console.log('Similar tracks:', data);
                    if (data.length > 0) {
                        const getTrackIds = async () => {
                            try {
                                const response = await fetch('http://localhost:5000/tracks/findTrackId', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ similarTracks: data }),
                                    credentials: 'include'
                                });
                                const data2 = await response.json();
                                setTrackIds(data2);
                            } catch (error) {
                                console.error('Error fetching track ids:', error.message);
                            }
                        }

                        getTrackIds();
                    }
                } catch (error) {
                    console.error('Error fetching similar tracks:', error.message);
                }
            }

            getSimilarTracks(tracksShow);
        }
    };

    return (
        <div>
            <button onClick={handleGetSimilarTracks}>Get Similar Tracks</button>
            <div className='track-container'>
                {trackIdsShow}
            </div>
        </div>
    );
}

export default SimilarTracks;