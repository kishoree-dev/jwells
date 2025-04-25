import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common/apiConfig.js';

function BestOfHridhayamSection({ className, title, images, link }) {
  const carouselRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
        console.log("API data fetched successfully:", data.data);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    }

    // Call the initialization functions
    getData();
    console.log(categories ? categories : "hello world");
  }, []);

  const getRandomCategory = () => {
    if (categories.length === 0) return null;
    let newCategory;
    do {
      const randomIndex = Math.floor(Math.random() * categories.length);
      newCategory = categories[randomIndex];
    } while (newCategory === selectedCategory);
    setSelectedCategory(newCategory); // Fixed variable name
  };

  const handleNavigate = (category, e) => {
    e.preventDefault();
    navigate('/collection', { state: { collectionName: category } });
    window.scrollTo(0, 0);
  };

  const handleDiscountsNavigate = (e) => {
    e.preventDefault();
    navigate('/discounts');
    window.scrollTo(0, 0);
  };

  return (
    <section className={`py-8 h-[100vh] ${className}`}>
      <h2 className="text-3xl text-black font-[cinzel] font-regular text-center mb-6">{title}</h2>
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-center" ref={carouselRef}>
          {images.map((image, index) => (
            <a
              key={index}
              href="/collection"
              onClick={(e) => handleNavigate(categories[index], e)}
              className="group relative"
            >
              <img
                src={image}
                alt={`Best Carousel ${index + 1}`}
                className="w-full h-64 md:h-[100px] md:w-[100px] object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              {categories[index] && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                             bg-black/70 text-white px-4 py-2 rounded-md text-sm
                             transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  {categories[index]}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
      <div className="text-center mt-8">
        <a
          href="/discounts"
          onClick={handleDiscountsNavigate}
          className="inline-block text-2xl font-[lora] px-8 py-4 outline-solid
                     text-black font-regular shadow-lg 
                     hover:from-blue-600 hover:to-purple-700
                     transform hover:scale-105 transition-all duration-300
                     uppercase tracking-wide"
        >
          Explore Collection
        </a>
      </div>
    </section>
  );
}

export default BestOfHridhayamSection;
