import Carousel from '../components/Main/Carousel'

const MainPage = () => {
  return (
    <>
        <div className="carousel-section">
            <Carousel />
        </div>
    
        <section className="home-cards-container animate__backInUp">
            <div className="home-card">
                <h2>New sounds, same soul.</h2>
                <p>Discover tracks from similar artists that match your playlist’s energy.</p>
            </div>
            <div className="home-card">
                <h2>Your playlist, reimagined.</h2>
                <p>You’ve built the vibe. Now we expand it.</p>
            </div>
            <div className="home-card">
                <h2>Click. Save. Repeat.</h2>
                <p>Liked what you heard? Add it to your library with one tap.</p>
            </div>
        </section>
    </>
  )
}

export default MainPage