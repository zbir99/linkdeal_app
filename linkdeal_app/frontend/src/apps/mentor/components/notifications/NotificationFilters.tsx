import { FunctionComponent, useState } from 'react';

const NotificationFilters: FunctionComponent = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = [
    { name: 'All', count: 0 },
    { name: 'Booking', count: 0 },
    { name: 'Payment', count: 0 }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.name}
          onClick={() => setActiveFilter(filter.name)}
          className={`px-4 py-2 rounded-lg text-sm font-arimo transition-all duration-300 ${activeFilter === filter.name
              ? 'bg-[#7008E7] text-white shadow-lg shadow-[#7008E7]/30'
              : 'bg-white/5 border border-white/20 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
        >
          {filter.name}
          {filter.count > 0 && (
            <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded-full hover:bg-white/30 hover:scale-110 transition-all duration-300 cursor-pointer">
              {filter.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default NotificationFilters;

