import React from 'react';

const NoProductsFound = ({ onResetFilters }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[400px] w-full">
            <div className="mb-6">
                <svg className="w-32 h-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5}
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
                We couldn't find any products matching your current filters. Try adjusting your search criteria.
            </p>
            <button
                onClick={onResetFilters}
                className="px-6 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#B08F26] transition-colors duration-200 flex items-center"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Filters
            </button>
        </div>
    );
};

export default NoProductsFound;
