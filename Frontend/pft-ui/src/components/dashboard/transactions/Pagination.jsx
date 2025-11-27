import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null; // No pagination needed

  // Limit page numbers displayed to improve UX for large datasets
  const maxPageButtons = 5; // Show max 5 page buttons
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50 rounded-lg">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Previous
      </button>

      <div className="flex items-center space-x-1">
        {/* Show first page if not visible */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="px-2 py-2 text-gray-500">...</span>}
          </>
        )}

        {/* Show page numbers */}
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-3 py-2 text-sm rounded ${
              currentPage === num
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {num}
          </button>
        ))}

        {/* Show last page if not visible */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="px-2 py-2 text-gray-500">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next →
      </button>

      {/* Page info */}
      <div className="text-xs text-gray-600 ml-4">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
