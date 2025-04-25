import React from 'react';

const Pagination = ({ currentPage, totalPages, onPrevPage, onNextPage, onPageSelect }) => {
    return (
        <nav className="flex items-center gap-x-1 pb-10" aria-label="Pagination">
            <button type="button" className="bg-gray-300 hover:bg-[#FFD700] text-black min-h-[38px] cursor-pointer min-w-[38px] flex justify-center items-center py-2 px-3 rounded-lg" aria-label="Previous" onClick={onPrevPage} disabled={currentPage === 1}>
                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m15 18-6-6 6-6"></path>
                </svg>
                <span>Previous</span>
            </button>
            <div className="flex items-center gap-x-1">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => onPageSelect(index + 1)}
                        type="button"
                        className={`min-h-[38px] min-w-[38px] flex justify-center  items-center rounded-lg ${
                    currentPage === index + 1
                        ? 'bg-black text-white'
                        : 'bg-[#41444B] hover:bg-[#FFD700] cursor-pointer'
                }`}
                        aria-current={currentPage === index + 1 ? "page" : undefined}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <button type="button" className="bg-gray-300 hover:bg-[#FFD700] cursor-pointer text-gray-800 min-h-[38px] min-w-[38px] flex justify-center items-center py-2 px-3 rounded-lg" aria-label="Next" onClick={onNextPage} disabled={currentPage === totalPages}>
                <span>Next</span>
                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m9 18 6-6-6-6"></path>
                </svg>
            </button>
        </nav>
    );
};

export default Pagination;
