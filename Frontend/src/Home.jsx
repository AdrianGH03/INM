import { useEffect, useContext, useState } from 'react';
import { UserContext } from './contexts/UserContext';
import { useNavigate } from 'react-router-dom';

function Home() {
    const { profile, setProfile } = useContext(UserContext);
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState(() => {
        const savedPlaylists = localStorage.getItem('playlists');
        return savedPlaylists ? JSON.parse(savedPlaylists) : [];
    });
    //User Tracks
    const [tracks, setTracks] = useState([]);
    const [filteredTracks, setFilteredTracks] = useState([]);
    const [tracksShow, setTracksShow] = useState(null);

    //Similar Tracks
    const [similarTracks, setSimilarTracks] = useState([]);
    const [trackIds, setTrackIds] = useState([]);
    const [trackIdsShow, setTrackIdsShow] = useState(null);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const tracksPerPage = 50;

    //Genres
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);

    //1. Get users playlists
    useEffect(() => {
        if(!playlists.playlists || playlists.playlists.length === 0){
            const getPlaylists = async () => {
                try {
                    const response = await fetch('http://localhost:5000/playlists/getUserSongs', {
                        credentials: 'include'
                    });
                    if (!response.ok) {
                        navigate('/');
                    }
                    const data = await response.json();
                    setPlaylists(data);
                    localStorage.setItem('playlists', JSON.stringify(data));
                } catch (error) {
                    console.error('Error fetching playlists:', error.message);
                }
            };
    
            getPlaylists();
        }
    }, [navigate]);

    //2. Get tracks from playlist of choice
    useEffect(() => {
        if (playlists.playlists && playlists.playlists.length > 0) {
            const getTracks = async () => {
                var firstPlaylistId = playlists.playlists[1].id;
                try {
                    const response = await fetch(`http://localhost:5000/playlists/getPlayListTracks/${firstPlaylistId}?page=${currentPage}&limit=${tracksPerPage}`, {
                        credentials: 'include'
                    });
                    
                    const data = await response.json();
                    const uniqueGenres = new Set();
                    for(let track of data){
                        const genre = track.track.artists[0].genres[0];
                        if (genre) {
                            uniqueGenres.add(genre);
                        }
                    }
                    setGenres(Array.from(uniqueGenres));
                    console.log("Genres: ", Array.from(uniqueGenres));
                    setTracks(data);
                    setFilteredTracks(data);
                } catch (error) {
                    console.error('Error fetching playlist tracks:', error.message);
                }
            };
            getTracks();
        }
    }, [playlists]);

    //3. Show user's playlist tracks and handle pagination on screen
    useEffect(() => {
        if (filteredTracks.length > 0) {
            const startIndex = (currentPage - 1) * tracksPerPage;
            const endIndex = startIndex + tracksPerPage;
            const tracksToShow = filteredTracks.slice(startIndex, endIndex);
            const tracksShow = tracksToShow.map((track, index) => {
                return (
                    <div key={`${track.track.id}-${index}`} className='track'>
                        <img src={track.track.album.images[0].url} alt={track.track.album.name} 
                            style={{ width: '100px', height: '100px' }}
                        />
                        <div>
                            <h3>{track.track.name}</h3>
                            <p>{track.track.artists[0].name}</p>
                            <p>{track.track.album.name}</p>
                        </div>
                    </div>
                )
            });
            setTracksShow(tracksShow);
        } else {
            setTracksShow(null);
        }
    }, [filteredTracks, currentPage]);

    //5. Show similar tracks on screen
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
                                <audio controls className='audio' volume='0.01'>
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
    }, [trackIds]);

    const shuffleTracks = () => {
        const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
        setTracks(shuffledTracks);
        setFilteredTracks(shuffledTracks);
    };

    const handleNextPage = () => {
        if ((currentPage * tracksPerPage) < filteredTracks.length) {
            setCurrentPage(prevPage => prevPage + 1);
            setTrackIds([]);
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    //4. Get Similar Tracks
    const handleGetSimilarTracks = () => {
        if (tracksShow && tracksShow.length > 0) {
            const onlyNamesAndArtists = tracksShow.map(track => {
                return { name: track.props.children[1].props.children[0].props.children, artist: track.props.children[1].props.children[1].props.children };
            });
            console.log("Tracks: ", onlyNamesAndArtists);  
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
                    setSimilarTracks(data);
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
            {/* <h1>Welcome, {profile.display_name}</h1>
            {profile.images && profile.images.length > 0 && (
                <img src={profile.images[0].url} alt="Profile" />
            )}
            <p>Email: {profile.email}</p> */}

            <h2>Your Playlists</h2>
            <button onClick={shuffleTracks}>Shuffle Tracks</button>
            <div className='genres'>
                <button onClick={() => handleGenreClick(null)}>All</button>
                {genres.map((genre, index) => (
                    <button key={index} onClick={() => handleGenreClick(genre)}>{genre}</button>
                ))}
            </div>
            <div className='track-container'>
                {tracksShow}
            </div>

            <div>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                <button onClick={handleNextPage} disabled={
                    (currentPage * tracksPerPage) >= filteredTracks.length
                }>Next</button>
            </div>
            <button onClick={handleGetSimilarTracks}>Get Similar Tracks</button>

            <h2>Similar Tracks</h2>
            <div className='track-container'>
                {trackIdsShow}
            </div>
        </div>
    );
}

export default Home;