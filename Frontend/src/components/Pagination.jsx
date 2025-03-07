function Pagination({ currentPage, setCurrentPage, tracksPerPage, filteredTracks }) {
    const handleNextPage = () => {
        if ((currentPage * tracksPerPage) < filteredTracks.length) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    return (
        <div>
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
            <button onClick={handleNextPage} disabled={(currentPage * tracksPerPage) >= filteredTracks.length}>Next</button>
        </div>
    );
}

export default Pagination;