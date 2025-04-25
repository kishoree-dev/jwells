import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/productCard';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';
import NoProductsFound from '../components/NoProductsFound';
import SummaryApi from "../common/apiConfig";
import LoadingModal from '../components/LoadingModal';

const Collection = () => {
  const { state: { collectionName } } = useLocation();
  const [state, setState] = useState({
    products: [],
    allProducts: [],
    currentPage: 1,
    selectedCategories: [collectionName], // Changed from selectedCategory to selectedCategories array
    maxPrice: 1000,
    priceRange: '0-1000',
    statusFilters: ['instock'] // Add default status filter
  });
  const [shouldResetFilters, setShouldResetFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch products for all selected categories
        const productPromises = state.selectedCategories.map(category =>
          fetch(`${SummaryApi.categoryProduct.url}${category}`)
            .then(res => res.json())
            .then(({ data }) => data)
        );

        const productsArrays = await Promise.all(productPromises);
        // Flatten and remove duplicates based on product ID or some unique identifier
        const allProducts = [...new Set(productsArrays.flat())];

        const maxPrice = Math.max(...allProducts.map(p => p.price)) || 1000;
        setState(prev => ({
          ...prev,
          allProducts,
          products: filterProductsByPriceRange(allProducts, `0-${maxPrice}`, prev.statusFilters),
          maxPrice,
          priceRange: `0-${maxPrice}`
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [state.selectedCategories]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      products: filterProductsByPriceRange(prev.allProducts, prev.priceRange, prev.statusFilters)
    }));
  }, [state.priceRange, state.statusFilters]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      selectedCategories: [collectionName],
      currentPage: 1,
      priceRange: '0-1000' // Reset price range
    }));
    setShouldResetFilters(true); // Trigger sidebar reset
    setTimeout(() => setShouldResetFilters(false), 100);
  }, [collectionName]);

  const handlePageChange = (page) => {
    setState(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPaginatedProducts = () => {
    const start = (state.currentPage - 1) * 9;
    return state.products.slice(start, start + 9);
  };

  const filterProductsByPriceRange = (products, priceRange, statusFilters) => {
    const [min, max] = priceRange.split('-').map(Number);
    return products.filter(product => {
      const priceInRange = product.price >= min && product.price <= max;

      // Status filtering logic
      const statusMatch = statusFilters.length === 2 || // Both filters selected
        (statusFilters.includes('instock') && product.inStock) ||
        (statusFilters.includes('preorder') && !product.inStock);

      return priceInRange && statusMatch;
    });
  };

  const resetFilters = () => {
    const defaultPriceRange = `0-${state.maxPrice}`;
    setState(prev => ({
      ...prev,
      priceRange: defaultPriceRange,
      products: filterProductsByPriceRange(prev.allProducts, defaultPriceRange, prev.statusFilters),
      selectedCategories: [collectionName],
      currentPage: 1
    }));
    setShouldResetFilters(true);
    // Reset the trigger after a short delay
    setTimeout(() => setShouldResetFilters(false), 100);
  };

  const renderProducts = () => {
    const paginatedProducts = getPaginatedProducts();

    if (state.products.length === 0) {
      return <NoProductsFound onResetFilters={resetFilters} />;
    }

    return (
      <>
        <div className="py-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
          {paginatedProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        <Pagination
          currentPage={state.currentPage}
          totalPages={Math.ceil(state.products.length / 9)}
          onPrevPage={() => handlePageChange(state.currentPage - 1)}
          onNextPage={() => handlePageChange(state.currentPage + 1)}
          onPageSelect={handlePageChange}
        />
      </>
    );
  };

  return (
    <>
      {isLoading && <LoadingModal />}
      <div className="contain flex">
        <Sidebar
          onPriceRangeChange={range => setState(prev => ({
            ...prev,
            priceRange: range,
            currentPage: 1
          }))}
          onCategoryChange={categories => {
            const updatedCategories = categories.includes(collectionName)
              ? categories
              : [collectionName, ...categories];
            setState(prev => ({
              ...prev,
              selectedCategories: updatedCategories,
              currentPage: 1
            }));
          }}
          onStatusChange={statusFilters => setState(prev => ({
            ...prev,
            statusFilters,
            currentPage: 1
          }))}
          selectedCategory={collectionName}
          maxPrice={state.maxPrice}
          shouldReset={shouldResetFilters}
          statusFilters={state.statusFilters}
        />
        <div className="flex-1 px-4">
          {renderProducts()}
        </div>
      </div>
    </>
  );
};

export default Collection;
