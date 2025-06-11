

const Header = () => {
  return (
    <>
        <nav className="header-navbar">
            <div className="header-container">
                <img src="../../../public/INMLogo.png" alt="Logo" className="header-logo" />

                {/* make this button dynamic to show if the user is logged in or not */}
                <a href='http://localhost:5000/callback' className="header-spotify-button">
                    <span className="header-spotify-text">Connect with</span>
                    <img src="../../../public/spotify.png" alt="Spotify Icon" className="header-spotify-icon" />
                   
                </a>
            </div>
        </nav>

    </>
  )
}

export default Header