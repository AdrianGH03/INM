function Genres({ genres, handleGenreClick }) {
    return (
        <div className='genres'>
            <button onClick={() => handleGenreClick(null)}>All</button>
            {genres.map((genre, index) => (
                <button key={index} onClick={() => handleGenreClick(genre)}>{genre}</button>
            ))}
        </div>
    );
}

export default Genres;