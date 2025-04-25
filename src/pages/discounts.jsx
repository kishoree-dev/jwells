import React, { useEffect, useState } from "react";
import ProductCard from '../components/productCard';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';
import NoProductsFound from '../components/NoProductsFound';
import SummaryApi from "../common/apiConfig";
import LoadingModal from '../components/LoadingModal';

const Discounts = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [state, setState] = useState({
        products: [],
        allProducts: [],
        currentPage: 1,
        selectedCategories: [],
        maxPrice: 1000,
        priceRange: '0-1000',
        statusFilters: ['instock']
    });
    const [shouldResetFilters, setShouldResetFilters] = useState(false);

    useEffect(() => {
        const fetchDiscountedProducts = async () => {
            try {
                const response = await fetch(SummaryApi.discount.url, {
                    method: SummaryApi.discount.method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                    mode: 'cors',
                });
                const { data } = await response.json();
                // Filter products with discounts
                const discountedProducts = data.filter(product => product.discountPercentage > 0);
                const maxPrice = Math.max(...discountedProducts.map(p => p.price)) || 1000;

                setState(prev => ({
                    ...prev,
                    allProducts: discountedProducts,
                    products: filterProducts(
                        discountedProducts,
                        `0-${maxPrice}`,
                        prev.statusFilters,
                        prev.selectedCategories
                    ),
                    maxPrice,
                    priceRange: `0-${maxPrice}`
                }));
            } catch (error) {
                console.error("Error fetching discounted products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDiscountedProducts();
    }, []);

    const handlePageChange = (page) => {
        setState(prev => ({ ...prev, currentPage: page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPaginatedProducts = () => {
        const start = (state.currentPage - 1) * 9;
        return state.products.slice(start, start + 9);
    };

    const filterProducts = (products, priceRange, statusFilters, categories) => {
        const [min, max] = priceRange.split('-').map(Number);
        return products.filter(product => {
            const priceInRange = product.price >= min && product.price <= max;

            // Status filter
            const statusMatch = statusFilters.length === 0 ||
                (statusFilters.includes('instock') && product.inStock) ||
                (statusFilters.includes('preorder') && !product.inStock);

            // Only apply category filter if categories are selected
            const categoryMatch = categories.length === 0 ? true :
                categories.includes(product.category);

            return priceInRange && statusMatch && categoryMatch;
        });
    };

    const resetFilters = () => {
        const defaultPriceRange = `0-${state.maxPrice}`;
        const defaultStatusFilters = ['instock'];
        setState(prev => ({
            ...prev,
            priceRange: defaultPriceRange,
            selectedCategories: [],
            statusFilters: defaultStatusFilters,
            products: filterProducts(prev.allProducts, defaultPriceRange, defaultStatusFilters, []),
            currentPage: 1
        }));
        setShouldResetFilters(true);
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
                    {paginatedProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
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
                        products: filterProducts(
                            prev.allProducts,
                            range,
                            prev.statusFilters,
                            prev.selectedCategories
                        ),
                        currentPage: 1
                    }))}
                    onCategoryChange={categories => {
                        console.log(categories);
                        setState(prev => ({
                            ...prev,
                            selectedCategories: categories,
                            products: filterProducts(
                                prev.allProducts,
                                prev.priceRange,
                                prev.statusFilters,
                                categories
                            ),
                            currentPage: 1
                        }));
                    }}
                    onStatusChange={statusFilters => setState(prev => ({
                        ...prev,
                        statusFilters,
                        products: filterProducts(
                            prev.allProducts,
                            prev.priceRange,
                            statusFilters,
                            prev.selectedCategories
                        ),
                        currentPage: 1
                    }))}
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

export default Discounts;
