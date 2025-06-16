import { useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

function Playlists({ playlists, setPlaylists }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!playlists.playlists || playlists.playlists.length === 0) {
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
    }, [navigate, playlists, setPlaylists]);

    return (
        <div className='playlists-container'>
            <h2>Your Playlists</h2>
            {playlists.playlists && playlists.playlists.length > 0 ? (
                playlists.playlists.map((playlist, index) => (
                    <div key={index} className='playlist-item'>
                        <img src={playlist.images[0].url} alt={playlist.name} className='playlist-image' />
                        <h3>{playlist.name}</h3>
                        <p>{playlist.description}</p>
                    </div>
                ))
            ) : (
                <p>No playlists found.</p>
            )}
        </div>
    )
}

export default Playlists;