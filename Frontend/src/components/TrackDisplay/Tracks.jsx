import { useEffect, useState } from 'react';
import LoadingSpinner from '../Loading/LoadingSpinner';

function Tracks({ playlists, currentPage, currentPlaylistId, tracksPerPage, setTracks, setFilteredTracks, setGenres, setTracksShow, filteredTracks = [], setCurrentTrack }) {
    const [isLoading, setIsLoading] = useState(false);    useEffect(() => {
        if (playlists.playlists && playlists.playlists.length > 0 && currentPlaylistId) {
            const getTracks = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_SITE_URL}/playlists/getPlayListTracks/${currentPlaylistId}?page=${currentPage}&limit=${tracksPerPage}`, {
                        credentials: 'include'
                    });

                    const data = await response.json();
                    const genreCount = {};
                    for (let track of data) {
                        const genre = track.track.artists[0].genres[0];
                        if (genre) {
                            genreCount[genre] = (genreCount[genre] || 0) + 1;
                        }
                    }

                    const filteredGenres = Object.keys(genreCount).filter(genre => genreCount[genre] >= 3);
                    setGenres(filteredGenres);
                    setTracks(data);
                    setFilteredTracks(data);
                    
                } catch (error) {
                    console.error('Error fetching playlist tracks:', error.message);
                } finally {
                    setIsLoading(false);
                }
            };
            getTracks();
        }
    }, [playlists, currentPlaylistId, setTracks, setFilteredTracks, setGenres]);    
    
    //Show tracks for user playlist, tracksShow = true means tracks are shown, false means no tracks to show
    useEffect(() => {
        if (isLoading) {
            setTracksShow(<LoadingSpinner text="Loading tracks..." />);
        } else if (filteredTracks.length > 0) {
            const startIndex = (currentPage - 1) * tracksPerPage;
            const endIndex = startIndex + tracksPerPage;
            const tracksToShow = filteredTracks.slice(startIndex, endIndex);              
            const tracksShow = tracksToShow.map((track, index) => {
                return (
                    <a href={`${track.track.external_urls.spotify}`} className="track-href" target='_blank' rel='noopener noreferrer'>
                        <div 
                            key={`${track.track.id}-${index}`} 
                            className='track'
                        >
                            <img src={track.track.album.images[0].url} alt={track.track.album.name} 
                                style={{ width: '100px', height: '100px' }}
                            />
                            <div>
                                <h3>{track.track.name}</h3>
                                <p>{track.track.artists[0].name}</p>
                                <p>{track.track.album.name}</p>
                            </div>
                        </div>
                    </a>
                )
            });
            setTracksShow(tracksShow);
        } else {
            setTracksShow(null);
        }
    }, [filteredTracks, currentPage, isLoading]);

    return null;
}

export default Tracks;