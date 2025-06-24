import { useEffect, useRef, useState } from 'react';
import LoadingSpinner from '../Loading/LoadingSpinner';

function SimilarTracks({ setCurrentQueueIndex, setTrackIds, trackIds, trackIdsShow, setTrackIdsShow, setCurrentTrack, filteredTracks, currentPage, tracksPerPage, onTrackSelect }) {
    
    const audioRefs = useRef([]);  
    const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
      useEffect(() => {
        if (isLoadingSimilar) {
            setTrackIdsShow(<LoadingSpinner text="Finding similar tracks..." />);
        } else if (trackIds.length > 0) {
            const trackIdsShow = trackIds.map((track, index) => {
                return (
                    <div key={`${track.id}-${index}`} className='track similar-track'>
                        <img 
                            src={track.images[0].url} 
                            alt={track.name} 
                            style={{ width: '100px', height: '100px', cursor: 'pointer' }}                            
                            onClick={() => {
                                const newTrack = {
                                    track: {
                                        name: track.name,
                                        artists: [{ name: track.artist }],
                                        album: { 
                                            name: track.name,
                                            images: track.images 
                                        },
                                        preview_url: track.preview_url
                                    }
                                };
                                setCurrentTrack(newTrack);
                                setCurrentQueueIndex(index);
                                
                                if (onTrackSelect) {
                                    onTrackSelect(newTrack);
                                }
                            }}
                        />
                        <div>
                            <h3>{track.name}</h3>
                            <p>{track.artist}</p>
                            <p>Popularity: {track.popularity}</p>
                        </div>
                    </div>
                )
            });
            setTrackIdsShow(trackIdsShow);
        } else {
            setTrackIdsShow(null);
        }
    }, [trackIds, setTrackIdsShow, setCurrentTrack, isLoadingSimilar]);

    
    useEffect(() => {
        audioRefs.current.forEach(audio => {
            if (audio) {
                audio.volume = 0.5;
            }
        });
    }, [trackIdsShow]);        
    
      const handleGetSimilarTracks = () => {
        if (filteredTracks && filteredTracks.length > 0) {
            if (onTrackSelect) {
                onTrackSelect(null); 
            }
            
            setTrackIds([]);
            setTrackIdsShow(null);
            setIsLoadingSimilar(true);
            
            const startIndex = (currentPage - 1) * tracksPerPage;
            const endIndex = startIndex + tracksPerPage;
            const currentPageTracks = filteredTracks.slice(startIndex, endIndex);
            
            const onlyNamesAndArtists = currentPageTracks.map(track => {
                return { 
                    name: track.track.name, 
                    artist: track.track.artists[0].name 
                };
            });
            
            const getSimilarTracks = async (tracks) => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_SIMTRAC_URL}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ tracks: onlyNamesAndArtists }),
                        credentials: 'include'
                    });
                    const data = await response.json();
                    if (data.length > 0) {
                        const getTrackIds = async () => {
                            try {
                                const response = await fetch(`${import.meta.env.VITE_API_FINDTID_URL}`, {
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
                            } finally {
                                setIsLoadingSimilar(false);
                            }
                        }

                        getTrackIds();
                    } else {
                        setIsLoadingSimilar(false);
                    }
                } catch (error) {
                    console.error('Error fetching similar tracks:', error.message);
                    setIsLoadingSimilar(false);
                }
            }

            getSimilarTracks(onlyNamesAndArtists);
        }
    };
    
    return (
        <div className="similar-tracks-section">
            {filteredTracks && filteredTracks.length > 0 && (
                <div className="similar-tracks-header">
                    <h2>Discover Similar Music</h2>
                    <p>Find new tracks that match your playlist's vibe</p>                    <button 
                        onClick={handleGetSimilarTracks} 
                        className="get-similar-tracks-btn"
                        disabled={!filteredTracks || filteredTracks.length === 0 || isLoadingSimilar}
                    >
                        <i className="bi bi-music-note-beamed"></i>
                        {isLoadingSimilar ? 'Finding Tracks...' : 'Get Similar Tracks'}
                    </button>
                </div>
            )}
              {trackIdsShow && (
                <>
                    {!isLoadingSimilar && (
                        <div className="similar-tracks-results-header">
                            <h3>
                                <i className="bi bi-soundwave"></i>
                                Similar Tracks ({trackIds.length} found)
                            </h3>
                            <p>Click on track images to play audio through the player</p>
                        </div>
                    )}
                    <div className='track-container similar-tracks-container'>
                        {trackIdsShow}
                    </div>
                </>
            )}
        </div>
    );
}

export default SimilarTracks;