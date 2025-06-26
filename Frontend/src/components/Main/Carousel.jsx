

const albums = [
  { id: 1, img: 'alb3.jpg', title: 'Album 1' },
  { id: 2, img: 'alb2.jpg', title: 'Album 2' },
  { id: 3, img: 'alb1.jpg', title: 'Album 3' },
  { id: 4, img: 'alb4.jpg', title: 'Album 4' },
  { id: 5, img: 'alb5.jpg', title: 'Album 5' },
];

//Home Page Carousel Component
export default function Carousel() {
  return (
    <div className="carousel">
      <h1 className="app-title">Find Your Hidden <span>GEM</span></h1>
      {albums.map((album, idx) => (
        <div
          key={album.id}
          className={`carousel-card card-${idx}`}
          style={{ backgroundImage: `url(${album.img})` }}
          title={album.title}
        />
      ))}
    </div>
  );
}