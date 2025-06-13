

const Header = ({ profile }) => {
  return (
    <>
        <header className="header">
            <nav className="header-container">
                <img src="INMLogo.png" alt="Logo" className="header-logo" />

                {/* make this button dynamic to show if the user is logged in or not */}
                {profile ? (
                    <div className="header-profile">
                        {profile.display_name.length > 15 ? (
                            <span className="header-profile-name">Welcome, {profile.display_name.slice(0, 15)}...</span>
                        ) : (
                            <span className="header-profile-name">Welcome, {profile.display_name}</span>
                        )}
                        <img src={profile.images[0].url} alt="Profile" className="header-profile-image" />
                    </div>
                ) : (
                    <a href='http://localhost:5000/callback' className="header-spotify-button">
                        <span className="header-spotify-text">Connect with</span>
                        <img src="spotify.png" alt="Spotify Icon" className="header-spotify-icon" />
                      
                    </a>
                )}
            </nav>
        </header>

    </>
  )
}

export default Header