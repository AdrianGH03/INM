//Handle pagination for playlist tracks lists, max 48-50 per page.
function Pagination({ 
    currentPage, 
    setCurrentPage, 
    tracksPerPage, 
    filteredTracks 
    }) {
        
    const handleNextPage = () => {
        if ((currentPage * tracksPerPage) < filteredTracks.length) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    return (
        <div className='pagination-buttons'>
            <button onClick={handlePreviousPage} disabled={currentPage === 1}><i class="bi bi-arrow-left-circle"></i></button>
            <span>{currentPage}</span>
            <button onClick={handleNextPage} disabled={(currentPage * tracksPerPage) >= filteredTracks.length}><i class="bi bi-arrow-right-circle"></i></button>
        </div>
    );
}

export default Pagination;