import React, { useState, useEffect } from 'react';
import './ImageCarousel.css';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextClick = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const handlePrevClick = () => {
    setCurrentIndex(
      currentIndex === 0 ? images.length - 1 : currentIndex - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNextClick();
    }, 10000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="carousel">
      <button className='prev' onClick={handlePrevClick}>&lt;</button>
      <img src={images[currentIndex]} alt="Slideshow" />
      <button className='next' onClick={handleNextClick}>&gt;</button>
    </div>
  );
};

export default ImageCarousel;


