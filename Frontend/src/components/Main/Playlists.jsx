import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Playlists({ playlists, setPlaylists, setCurrentPlaylistId, tracksShow }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!playlists.playlists || playlists.playlists.length === 0) {
            const getPlaylists = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_USERSONGS_URL}`, {
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
            <h2>Choose a Playlist</h2>
            <div className="playlists-list">
                {playlists.playlists && playlists.playlists.length > 0 ? (
                    playlists.playlists.map((playlist, index) => (
                        <div key={index} className='playlist-item' onClick={() => setCurrentPlaylistId(playlist.id)}>
                            <img src={playlist.images[0].url} alt={playlist.name} className='playlist-image' />
                            <h3>{playlist.name.length > 17 ? playlist.name.slice(0, 17) + '...' : playlist.name}</h3>
                            <p>{playlist.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No playlists found.</p>
                )}
            </div>
        </div>
    )
}

export default Playlists;