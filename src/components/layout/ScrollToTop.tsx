'use client';

export default function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex justify-center py-3 mb-2">
      <button
        onClick={scrollToTop}
        className="text-gray-500 hover:text-pink-500 text-sm flex items-center space-x-1 transition-colors duration-200"
        aria-label="ページトップへ"
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
        <span>ページトップへ</span>
      </button>
    </div>
  );
}

