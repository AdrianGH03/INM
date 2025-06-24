import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import { UserContext } from './contexts/UserContext';
import { AppRoutes } from './routes/AppRoutes';

import './assets/styles/App.css';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

function App() {
    const [profile, setProfile] = useState(null);

    return (
        <UserContext.Provider value={{ profile, setProfile }}>
            <Router>
                <HomeWrapper />
            </Router>
        </UserContext.Provider>
    );
}

function HomeWrapper() {
    const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [filteredTracks, setFilteredTracks] = useState([]);
    const [trackIds, setTrackIds] = useState([]);
    const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
    const { profile, setProfile } = useContext(UserContext);
    const navigate = useNavigate();

    const handleBackToPlaylists = () => {
        setCurrentPlaylistId(null);
        setCurrentTrack(null);
        setTracks([]);
        setFilteredTracks([]);
        setTrackIds([]);
    };

    const handleShuffleTracks = () => {
        if (tracks.length > 0) {
            const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
            setTracks(shuffledTracks);
            setFilteredTracks(shuffledTracks);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PROFILE_URL}`, {
                    credentials: 'include'
                });
                if (!response.ok) {
                    navigate('/');
                }
                const data = await response.json();
                setProfile(data);
                 
            } catch (error) {
                if(error.status === 401){
                    navigate('/')
                }
                console.error('Error fetching profile:', error);
            } 
        };

        fetchProfile();
    }, []);


    return (
        <div className='app-container'>
            <Header profile={profile} />
                <AppRoutes 
                    currentPlaylistId={currentPlaylistId}
                    setCurrentPlaylistId={setCurrentPlaylistId}
                    currentTrack={currentTrack}
                    setCurrentTrack={setCurrentTrack}
                    tracks={tracks}
                    setTracks={setTracks}
                    filteredTracks={filteredTracks}
                    setFilteredTracks={setFilteredTracks}
                    trackIds={trackIds}
                    setTrackIds={setTrackIds}
                    onShuffleTracks={handleShuffleTracks}
                    setCurrentQueueIndex={setCurrentQueueIndex}
                />
            <Footer 
                currentPlaylistId={currentPlaylistId}
                onBackToPlaylists={handleBackToPlaylists}
                onShuffleTracks={handleShuffleTracks}
                currentTrack={currentTrack}
                trackIds={trackIds}
                setCurrentTrack={setCurrentTrack}
                setTrackIds={setTrackIds}
                setCurrentQueueIndex={setCurrentQueueIndex}
                currentQueueIndex={currentQueueIndex}
            />
        </div>
    );
}

export default App;