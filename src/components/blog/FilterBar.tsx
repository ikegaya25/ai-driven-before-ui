'use client';

interface FilterBarProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterBar({ selectedFilter, onFilterChange }: FilterBarProps) {
  const filters = [
    { value: 'all', label: 'すべて' },
    { value: 'recent', label: '最新' },
    { value: 'popular', label: '人気' },
    { value: 'with-images', label: '画像付き' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedFilter === filter.value
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
