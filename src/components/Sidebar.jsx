import React, { useState, useEffect } from 'react';
import SummaryApi from '../common/apiConfig.js';

const Sidebar = ({
    onPriceRangeChange,
    onCategoryChange,
    selectedCategory,
    maxPrice,
    shouldReset,
    statusFilters,
    onStatusChange
}) => {
    const [priceRange, setPriceRange] = useState([0, maxPrice]);
    const [tempPriceRange, setTempPriceRange] = useState([0, maxPrice]);
    const [isPriceRangeChanged, setIsPriceRangeChanged] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(new Set(selectedCategory ? [selectedCategory] : []));
    const [selectedStatus, setSelectedStatus] = useState(new Set(['instock']));
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls mobile sidebar visibility

    const fetchCategories = async () => {
        try {
            const response = await fetch(SummaryApi.category.url, {
                method: SummaryApi.category.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                mode: 'cors',
            });
            if (response.ok) {
                const data = await response.json();
                const categoryList = [];
                data.data.forEach(category => {
                    categoryList.push(category);
                });
                setCategories(categoryList);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        setPriceRange([0, maxPrice]);
        setTempPriceRange([0, maxPrice]);
        setIsPriceRangeChanged(false);
    }, [maxPrice]);

    useEffect(() => {
        if (shouldReset) {
            setPriceRange([0, maxPrice]);
            setTempPriceRange([0, maxPrice]);
            setIsPriceRangeChanged(false);
            setSelectedCategories(new Set([selectedCategory]));
            onCategoryChange([]);
            setSelectedStatus(new Set(['instock']));
        }
    }, [shouldReset, maxPrice]);

    const handlePriceChange = (e) => {
        const value = parseInt(e.target.value);
        setTempPriceRange([0, value]);
        setIsPriceRangeChanged(true);
    };

    const handleApplyPriceRange = () => {
        setPriceRange(tempPriceRange);
        onPriceRangeChange(`0-${tempPriceRange[1]}`);
        setIsPriceRangeChanged(false);
    };

    const handleCategoryChange = (category) => {
        const newSelectedCategories = new Set(selectedCategories);
        if (category === selectedCategory && newSelectedCategories.has(category)) {
            return;
        }

        if (newSelectedCategories.has(category)) {
            newSelectedCategories.delete(category);
        } else {
            newSelectedCategories.add(category);
        }
        setSelectedCategories(newSelectedCategories);
        onCategoryChange(Array.from(newSelectedCategories));
    };

    const handleStatusChange = (status) => {
        const newSelectedStatus = new Set(selectedStatus);
        if (newSelectedStatus.has(status)) {
            if (newSelectedStatus.size > 1) {
                newSelectedStatus.delete(status);
            }
        } else {
            newSelectedStatus.add(status);
        }
        setSelectedStatus(newSelectedStatus);
        onStatusChange(Array.from(newSelectedStatus));
    };

    const handleMinPriceChange = (e) => {
        const value = parseInt(e.target.value);
        setTempPriceRange([value, tempPriceRange[1]]);
        setIsPriceRangeChanged(true);
    };

    const handleMaxPriceChange = (e) => {
        const value = parseInt(e.target.value);
        setTempPriceRange([tempPriceRange[0], value]);
        setIsPriceRangeChanged(true);
    };

    return (
        <div className="mt-10 relative self-start">
            {/* Filter Heading - Always Visible */}
            <h3
                className="text-lg font-[cinzel] font-semibold mb-3 text-black cursor-pointer md:text-lg"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                Filter <div className='md:hidden'>{isSidebarOpen ? '▲' : '▼'}</div>
            </h3>

            {/* Sidebar Content - Hidden on Mobile by Default */}
            <div className={`fixed top-0 left-0 h-full w-64 p-4 bg-white transition-transform duration-300 ease-in-out transform z-5 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:block`}>
                {/* Close Button for Mobile */}
                <div className="md:hidden flex justify-end mb-4">
                    <button onClick={() => setIsSidebarOpen(false)} className="text-black md:hidden text-xl">&times;</button>
                </div>
                {/* Status Filter Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-[cinzel] font-thin mb-3 text-black md:text-lg">Status</h3>
                    <div className="mb-2 font-[cinzel] flex items-center md:text-base">
                        <input
                            type="checkbox"
                            id="instock"
                            checked={selectedStatus.has('instock')}
                            onChange={() => handleStatusChange('instock')}
                            className="w-4 h-4 mr-2 accent-[#D4AF37] cursor-pointer"
                        />
                        <label htmlFor="instock" className="text-black cursor-pointer hover:text-[#D4AF37]">
                            In Stock
                        </label>
                    </div>
                    <div className="mb-2 font-[cinzel] flex items-center md:text-base">
                        <input
                            type="checkbox"
                            id="preorder"
                            checked={selectedStatus.has('preorder')}
                            onChange={() => handleStatusChange('preorder')}
                            className="w-4 h-4 mr-2 accent-[#D4AF37] cursor-pointer"
                        />
                        <label htmlFor="preorder" className="text-black cursor-pointer hover:text-[#D4AF37]">
                            Pre-order
                        </label>
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-lg font-[cinzel] font-normal mb-3 text-black md:text-lg">Categories</h3>
                    {categories.map((category) => (
                        <div key={category} className="mb-2 font-[cinzel] flex items-center md:text-base">
                            <input
                                type="checkbox"
                                id={category}
                                value={category}
                                checked={selectedCategories.has(category)}
                                onChange={() => handleCategoryChange(category)}
                                disabled={category === selectedCategory}
                                className={`w-4 h-4 mr-2 ${category === selectedCategory
                                    ? 'accent-gray-400 cursor-not-allowed'
                                    : 'accent-[#D4AF37] cursor-pointer'
                                    }`}
                            />
                            <label htmlFor={category} className={`${category === selectedCategory
                                ? 'text-gray-600'
                                : 'text-black cursor-pointer hover:text-[#D4AF37]'
                                } transition-colors`}>
                                {category}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Price Range */}
                <div className="mb-6 mt-6">
                    <h3 className="text-lg font-[cinzel] font-normal mb-3 text-black">Price Range</h3>
                    <div className="flex flex-col space-y-2">
                        <input
                            type="range"
                            min="0"
                            max={maxPrice}
                            step="1"
                            value={tempPriceRange[1]}
                            onChange={handlePriceChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                        />
                        <div className="flex justify-between text-black">
                            <span>Rs.{tempPriceRange[1]}</span>
                        </div>
                        <button
                            onClick={handleApplyPriceRange}
                            disabled={!isPriceRangeChanged}
                            className={`mt-2 px-4 py-2 rounded ${isPriceRangeChanged
                                ? 'bg-[#D4AF37] text-white hover:bg-[#B08F26]'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                } transition-colors`}
                        >
                            Apply Filter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
