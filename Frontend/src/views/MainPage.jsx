import Carousel from '../components/Main/Carousel'

const MainPage = () => {
  return (
    <>
        {/* Home Page Carousel - Top Section */}
        <div className="carousel-section">
            <Carousel />
        </div>
    
        {/* Home Page Cards - Bottom Section */}
        <section className="home-cards-container animate__backInUp">
            
                <h2></h2>
                <p style={{ marginTop: '5rem', textAlign: 'center', lineHeight: '40px' }}>Due to Spotify API changes on March 9th, 2026, this site is temporarily down. Please refer to the <a href="https://github.com/AdrianGH03/INM" style={{color: 'aqua'}}>INM GitHub</a></p>
            
            
        </section>
    </>
  )
}

export default MainPage