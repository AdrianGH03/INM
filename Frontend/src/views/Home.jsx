import { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import Playlists from '../components/Playlists';
import Tracks from '../components/Tracks';
import Pagination from '../components/Pagination';
import Genres from '../components/Genres';
import SimilarTracks from '../components/SimilarTracks';

function Home() {
    const { profile } = useContext(UserContext);
    const [playlists, setPlaylists] = useState(() => {
        const savedPlaylists = localStorage.getItem('playlists');
        return savedPlaylists ? JSON.parse(savedPlaylists) : [];
    });
    const [tracks, setTracks] = useState([]);
    const [filteredTracks, setFilteredTracks] = useState([]);
    const [tracksShow, setTracksShow] = useState(null);
    const [similarTracks, setSimilarTracks] = useState([]);
    const [trackIds, setTrackIds] = useState([]);
    const [trackIdsShow, setTrackIdsShow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const tracksPerPage = 50;
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);

    const shuffleTracks = () => {
        const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
        setTracks(shuffledTracks);
        setFilteredTracks(shuffledTracks);
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

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Playlists playlists={playlists} setPlaylists={setPlaylists} />
            <Tracks playlists={playlists} currentPage={currentPage} tracksPerPage={tracksPerPage} setTracks={setTracks} setFilteredTracks={setFilteredTracks} setGenres={setGenres} setTracksShow={setTracksShow} filteredTracks={filteredTracks} />
            <h2>Your Playlists</h2>
            <button onClick={shuffleTracks}>Shuffle Tracks</button>
            <Genres genres={genres} handleGenreClick={handleGenreClick} />
            <div className='track-container'>
                {tracksShow}
            </div>
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} tracksPerPage={tracksPerPage} filteredTracks={filteredTracks} />
            <SimilarTracks tracksShow={tracksShow} setTrackIds={setTrackIds} trackIds={trackIds} trackIdsShow={trackIdsShow} setTrackIdsShow={setTrackIdsShow} />
        </div>
    );
}

export default Home;