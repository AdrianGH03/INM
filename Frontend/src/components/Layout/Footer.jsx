import { useRef, useEffect, useState } from 'react';
import '../../assets/styles/Layout/Footer.css';

const Footer = ({ currentPlaylistId, onBackToPlaylists, onShuffleTracks, currentTrack, trackIds, setCurrentTrack, setTrackIds, currentQueueIndex, setCurrentQueueIndex }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [queue, setQueue] = useState([]);
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [volume, setVolume] = useState(5); 


  useEffect(() => {
    if (trackIds && trackIds.length > 0) {
      const formattedQueue = trackIds.map(track => ({
        track: {
          name: track.name,
          artists: [{ name: track.artist }],
          album: { 
            name: track.name,
            images: track.images 
          },
          preview_url: track.preview_url,
          id: track.id
        }
      }));
      setQueue(formattedQueue);
      
      if (!currentTrack && formattedQueue.length > 0) {
        setCurrentQueueIndex(0);
        setCurrentTrack(formattedQueue[0]);
        
      }
    } else {
      setQueue([]);
      setCurrentQueueIndex(-1);
    }
  }, [trackIds, currentTrack, setCurrentTrack]);


  // Handle audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
    useEffect(() => {
    if (currentTrack?.track?.preview_url) {
      setHasAudio(true);
      setIsLoadingAudio(true);
      if (audioRef.current) {
       
        if (isPlaying) {
          audioRef.current.pause();
        }
       
        audioRef.current.src = currentTrack.track.preview_url;
        audioRef.current.volume = volume / 100; 
        audioRef.current.load();

        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        }).catch((error) => {
          
          setIsPlaying(false);
          setIsLoadingAudio(false);
        });
      }
    } else {
      setHasAudio(false);
      setIsPlaying(false);
      setIsLoadingAudio(false);
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [currentTrack, volume]); 

  const handlePlayPause = () => {
    if (!hasAudio || !audioRef.current || isLoadingAudio) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoadingAudio(true);
      audioRef.current.volume = volume / 100; 
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoadingAudio(false);
      }).catch((error) => {
        
        setIsPlaying(false);
        setIsLoadingAudio(false);
      });
    }
  };


  const handleAudioEnded = () => {
    setIsPlaying(false);
    handleNextTrack();
  };

  const handleNextTrack = () => {
    if (queue.length === 0) return;
    
    let nextIndex;
    if (currentQueueIndex === -1) {
      nextIndex = 0;
    } else if (currentQueueIndex < queue.length - 1) {
      nextIndex = currentQueueIndex + 1;
    } else {
      setCurrentTrack(null);
      setCurrentQueueIndex(-1);
      return;
    }
    
    setCurrentQueueIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
  };

  const handlePreviousTrack = () => {
    if (queue.length === 0) return;
    let prevIndex;

    if (currentQueueIndex === -1) {
      prevIndex = queue.length - 1;
    } else if (currentQueueIndex > 0) {
      prevIndex = currentQueueIndex - 1;
    } else {
      setCurrentTrack(null);
      setCurrentQueueIndex(-1);
      return;
    }
    
    setCurrentQueueIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
  };  
  
  
  const handleRemoveFromQueue = (indexToRemove) => {
    const newTrackIds = trackIds.filter((_, index) => index !== indexToRemove);
    setTrackIds(newTrackIds);
    
    if (indexToRemove < currentQueueIndex) {
      setCurrentQueueIndex(currentQueueIndex - 1);
    } else if (indexToRemove === currentQueueIndex) {
      setCurrentTrack(null);
      setCurrentQueueIndex(-1);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  };

  if (!currentPlaylistId) return null;


  
  return (
    <footer className="footer-playbar">
      <div className="footer-content">
        {/* Left section - Current track info */}
        <div className="footer-track-info">
          {currentTrack ? (
            <>
              <img 
                src={currentTrack.track?.album?.images?.[0]?.url || '/placeholder.png'} 
                alt={currentTrack.track?.album?.name || 'Track'} 
                className="footer-track-image"
              />
              <div className="footer-track-details">
                <span className="footer-track-name">
                  {currentTrack.track?.name || 'No track selected'}
                </span>
                <span className="footer-track-artist">
                  {currentTrack.track?.artists?.[0]?.name || 'Unknown artist'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="footer-track-image-placeholder">
                <i className="bi bi-music-note"></i>
              </div>
              <div className="footer-track-details">
                <span className="footer-track-name">Select a track</span>
                <span className="footer-track-artist">Browse your playlist</span>
              </div>
            </>
          )}
        </div>

        {/* Center section - Playback controls */}
        <div className="footer-controls">

          <button className="footer-control-btn" onClick={onShuffleTracks} title="Shuffle Tracks">
            <i className="bi bi-shuffle"></i>
          </button>          
          <button className="footer-control-btn" onClick={handlePreviousTrack} title="Previous" disabled={queue.length === 0}>
            <i className="bi bi-skip-backward-fill"></i>
          </button>          <button 
            className="footer-play-btn" 
            onClick={handlePlayPause}
            disabled={!hasAudio || isLoadingAudio}
            title={
              isLoadingAudio ? "Loading audio..." : 
              hasAudio ? (isPlaying ? "Pause" : "Play") : 
              "No audio available"
            }
            style={{ 
              opacity: (hasAudio && !isLoadingAudio) ? 1 : 0.5,
              cursor: (hasAudio && !isLoadingAudio) ? 'pointer' : 'not-allowed'
            }}
          >
            {isLoadingAudio ? (
              <div className="audio-loading-spinner">
                <i className="bi bi-arrow-clockwise spinning"></i>
              </div>
            ) : (
              <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
            )}
          </button>

          <button className="footer-control-btn" onClick={handleNextTrack} title="Next" disabled={queue.length === 0}>
            <i className="bi bi-skip-forward-fill"></i>          
          </button>
          <button className="footer-control-btn" onClick={() => setCurrentTrack(null)} title="Repeat">
              <i className="bi bi-arrow-repeat"></i>
          </button>

        </div>

        {/* Right section - Volume and playlist controls */}
        <div className="footer-right-controls">
          <button className="footer-control-btn" onClick={onBackToPlaylists} title="Choose New Playlist">
            <i className="bi bi-collection-play"></i>
          </button>          
          
          <button 
            className="footer-control-btn queue-btn" 
            onClick={() => setShowQueueModal(true)} 
            title="Queue" 
            disabled={queue.length === 0}
          >
            <i className="bi bi-list-ul"></i>
            {queue.length > 0 && <span className="queue-count">{queue.length}</span>}
          </button>
          
          <div className="footer-volume-control">
            <i className="bi bi-volume-up"></i>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={handleVolumeChange}
              className="footer-volume-slider"
            />
            <span className="volume-display">{volume}%</span>
          </div>
          
        </div>
      </div>       
      
       {/* Queue Modal */}
      {showQueueModal && (
        <div className="queue-modal-overlay" onClick={() => setShowQueueModal(false)}>
          <div className="queue-modal" onClick={(e) => e.stopPropagation()}>
            
            <div className="queue-modal-header">
              <h3>
                <i className="bi bi-list-ul"></i>
                Queue ({queue.length} tracks)
              </h3>
              <button 
                className="queue-modal-close" 
                onClick={() => setShowQueueModal(false)}
                title="Close Queue"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="queue-modal-content">
              {queue.length === 0 ? (
                <p className="empty-queue">No tracks in queue. Add similar tracks to start listening!</p>
              ) : (
                <div className="queue-list">
                  {queue.map((track, index) => (
                    <div 
                      key={`queue-${track.track.id}-${index}`} 
                      className={`queue-item ${index === currentQueueIndex ? 'current-track' : ''}`}
                    >
                      <div className="queue-item-info" onClick={() => {
                        setCurrentQueueIndex(index);
                        setCurrentTrack(track);
                        setShowQueueModal(false);
                      }}>
                        <img 
                          src={track.track.album.images[0]?.url || '/placeholder.png'} 
                          alt={track.track.album.name} 
                          className="queue-item-image"
                        />
                        <div className="queue-item-details">
                          <span className="queue-item-name">{track.track.name}</span>
                          <span className="queue-item-artist">{track.track.artists[0].name}</span>
                        </div>
                        {index === currentQueueIndex && (
                          <i className="bi bi-play-fill current-indicator"></i>
                        )}
                      </div>
                      <button 
                        className="queue-remove-btn" 
                        onClick={() => handleRemoveFromQueue(index)}
                        title="Remove from queue"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={{ display: 'none' }}
      />
    </footer>
  );
};

export default Footer;
