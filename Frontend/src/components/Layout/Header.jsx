

const Header = ({ profile }) => {
  return (
    <>
        <header className="header">
            <nav className="header-container">
                <a href="/" alt="Go Home" className="header-logo-click">
                    <img src="INMLogo.png" alt="Go Home" className="header-logo" />
                </a>
                
                {profile ? (     
                    <a href="/home" className="header-profile-click">               
                        <div className="header-profile">
                            {profile.display_name.length > 12 ? (
                                <span className="header-profile-name">{profile.display_name.slice(0, 12)}...'s Page</span>
                            ) : (
                                <span className="header-profile-name">{profile.display_name}'s Page</span>
                            )}
                            <img src={profile.images[0].url} alt="Profile" className="header-profile-image" />
                        </div>
                    </a>
                ) : (
                    <a href={`${import.meta.env.VITE_API_CALLBACK_URL}`} className="header-spotify-button">
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