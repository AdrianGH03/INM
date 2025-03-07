import { useEffect } from 'react';

function Tracks({ playlists, currentPage, tracksPerPage, setTracks, setFilteredTracks, setGenres, setTracksShow, filteredTracks = [] }) {
    useEffect(() => {
        if (playlists.playlists && playlists.playlists.length > 0) {
            const getTracks = async () => {
                const firstPlaylistId = playlists.playlists[1].id;
                try {
                    const response = await fetch(`http://localhost:5000/playlists/getPlayListTracks/${firstPlaylistId}?page=${currentPage}&limit=${tracksPerPage}`, {
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

                    const filteredGenres = Object.keys(genreCount).filter(genre => genreCount[genre] >= 5);
                    setGenres(filteredGenres);
                    setTracks(data);
                    setFilteredTracks(data);
                } catch (error) {
                    console.error('Error fetching playlist tracks:', error.message);
                }
            };
            getTracks();
        }
    }, [playlists, setTracks, setFilteredTracks, setGenres]);

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

    return null;
}

export default Tracks;