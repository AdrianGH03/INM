import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import Playlists from '../components/Main/Playlists';
import Tracks from '../components/TrackDisplay/Tracks';
import Pagination from '../components/Buttons/Pagination';
import Genres from '../components/Buttons/Genres';
import SimilarTracks from '../components/TrackDisplay/SimilarTracks';
import LoadingSpinner from '../components/Loading/LoadingSpinner';

function Home(props) {
    const { 
        currentPlaylistId, 
        setCurrentPlaylistId,
        setCurrentTrack,
        tracks,
        setTracks,
        filteredTracks,
        setFilteredTracks,
        trackIds,
        setTrackIds,
        setCurrentQueueIndex
    } = props;
    
    const { profile } = useContext(UserContext);
    const [playlists, setPlaylists] = useState(() => {
        const savedPlaylists = localStorage.getItem('playlists');
        return savedPlaylists ? JSON.parse(savedPlaylists) : [];
    });    const [tracksShow, setTracksShow] = useState(null);
    const [trackIdsShow, setTrackIdsShow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const tracksPerPage = 48;
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);    
    
    const handleTrackSelect = (track) => {
        setCurrentTrack(track);
    };

    const handleGenreClick = (genre) => {
        setSelectedGenre(genre);
        if (genre) {
            const filtered = tracks.filter(track => track.track.artists[0].genres.includes(genre));
            setFilteredTracks(filtered);
        } else {
            setFilteredTracks(tracks);
        }
        setCurrentPage(1);
    };

    useEffect(() => {
        if (currentPlaylistId) {
            setTrackIds([]);
            setTrackIdsShow(null);
            setCurrentTrack(null); 
        }
    }, [currentPlaylistId, setCurrentTrack]);    
    
    if (!profile) {
        return (
            <section className='home'>
                <LoadingSpinner text="Loading your profile..." />
            </section>
        );
    }

    return (
        <section className='home'>
            {!currentPlaylistId ? (
                    <Playlists
                        playlists={playlists}
                        setPlaylists={setPlaylists}
                        currentPlaylistId={currentPlaylistId}
                        setCurrentPlaylistId={setCurrentPlaylistId}
                        setTracksShow={setTracksShow}
                    />
            ) : (           
                <>
                    <Tracks playlists={playlists} currentPlaylistId={currentPlaylistId} currentPage={currentPage} tracksPerPage={tracksPerPage} setTracks={setTracks} setFilteredTracks={setFilteredTracks} setGenres={setGenres} setTracksShow={setTracksShow} filteredTracks={filteredTracks} setCurrentTrack={setCurrentTrack} />
                    {filteredTracks.length > 0 && (
                        <Genres genres={genres} handleGenreClick={handleGenreClick} />
                    )}
                    <div className='track-container'>
                        {tracksShow}
                    </div>
                    {filteredTracks.length > 0 && (
                        <>
                            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} tracksPerPage={tracksPerPage} filteredTracks={filteredTracks} />
                        </>
                    )}
                    
                
                    <SimilarTracks 
                        tracksShow={tracksShow} 
                        setTrackIds={setTrackIds} 
                        trackIds={trackIds} 
                        trackIdsShow={trackIdsShow} 
                        setTrackIdsShow={setTrackIdsShow} 
                        setCurrentTrack={setCurrentTrack}
                        filteredTracks={filteredTracks}
                        currentPage={currentPage}
                        tracksPerPage={tracksPerPage}
                        onTrackSelect={handleTrackSelect}
                        setCurrentQueueIndex={setCurrentQueueIndex}
                    />
                </>
            )}            
            
        </section>
    );

}

export default Home;