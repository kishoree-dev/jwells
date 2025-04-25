import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common/apiConfig.js';

function Section({ className, title, image, link ,video}) {
  return (
    <section className={`section w-full relative bg-cover h-[100vh] ${className}`} style={{ backgroundImage: `url(${image})` }}>
      <div className="m-[0px] relative z-10">
        <div className="font-[lato] font-medium text-white mb-10 flex-nowrap tracking-[12px] pb-[30px] sm:text-[20px] sm:tracking-[6px] lg:text-[40px] lg:tracking-[12px]">{title}</div>
        <div className="flex">
        </div>
      </div>
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
function InbetweenSection({ content }) {
  return (
    <section className="flex justify-center items-center h-[30vh]">
      <div className="flex justify-center items-center relative font-[lato] text-black text-[20px] tracking-[6px]">{content}</div>
    </section>
  );
}

// CarouselSection Component
function CarouselSection({ className, title, images, description, buttonText }) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch(SummaryApi.category.url, {
          method: SummaryApi.category.method
        });
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          console.error("API data is not an array of strings:", data);
        }
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    }
    getData();
  }, []);

  const getCategoryForIndex = (index) => {
    if (categories.length === 0) return '';
    // If we have fewer categories than images, reuse categories in a circular manner
    return categories[index % categories.length];
  };

  const handleNavigate = (category, e) => {
    e.preventDefault();
    navigate('/collection', { state: { collectionName: category } });
    window.scrollTo(0, 0);
  };

  return (
    <section className={`section ${className} px-4`}>
      {title && <div className="font-[lato] font-medium text-black flex-nowrap tracking-[12px] pb-[30px] sm:text-[20px] sm:tracking-[6px] lg:text-[40px] lg:tracking-[12px]">{title}</div>}
      <div className="relative w-full ml-20 h-[300px] overflow-x-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex gap-45 items-center absolute left-0 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {images.map((image, index) => (
            <a
              key={index}
              href="/collection"
              onClick={(e) => handleNavigate(getCategoryForIndex(index), e)}
              className="relative flex-shrink-0 group cursor-pointer"
            >
              <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={image}
                  alt={`Carousel ${index + 1}`}
                />
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                          bg-black/70 text-white px-4 py-2 rounded-md text-sm
                          transition-opacity duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                {getCategoryForIndex(index)}
              </div>
            </a>
          ))}
        </div>
      </div>
      {description && <p className="mt-4">{description}</p>}
      {buttonText && (
        <div className="mt-8 text-center">
          <a
            href="/collection"
            onClick={(e) => handleNavigate('', e)}
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 
                   text-white font-bold rounded-full shadow-lg 
                   hover:from-blue-600 hover:to-purple-700 
                   transform hover:scale-105 transition-all duration-300
                   uppercase tracking-wide"
          >
            {buttonText}
          </a>
        </div>
      )}
    </section>
  );
}

export { Section, InbetweenSection, CarouselSection };
