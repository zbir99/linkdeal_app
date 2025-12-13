import { FunctionComponent } from 'react';

const ProgressChart: FunctionComponent = () => {
  return (
    <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6 relative overflow-hidden">
      <h2 className="text-xl font-semibold text-white mb-6">Your Progress</h2>
      
      {/* Chart Container */}
      <div className="relative h-96 w-full overflow-hidden">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1200 300" 
          preserveAspectRatio="none"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Grid lines */}
          <g opacity="0.1">
            <path d="M65 265H1150" stroke="white" stroke-dasharray="3 3"/>
            <path d="M65 200H1150" stroke="white" stroke-dasharray="3 3"/>
            <path d="M65 135H1150" stroke="white" stroke-dasharray="3 3"/>
            <path d="M65 70H1150" stroke="white" stroke-dasharray="3 3"/>
            <path d="M65 5H1150" stroke="white" stroke-dasharray="3 3"/>
            <path d="M65 5V265" stroke="white" stroke-dasharray="3 3"/>
            <path d="M309.25 5V265" stroke="white" stroke-dasharray="3 3"/>
            <path d="M553.5 5V265" stroke="white" stroke-dasharray="3 3"/>
            <path d="M797.75 5V265" stroke="white" stroke-dasharray="3 3"/>
            <path d="M1042 5V265" stroke="white" stroke-dasharray="3 3"/>
            <path d="M1150 5V265" stroke="white" stroke-dasharray="3 3"/>
          </g>
          
          {/* Main chart line */}
          <path 
            d="M65 187C146.417 172.917 227.833 158.833 309.25 148C390.667 137.167 472.083 132.833 553.5 122C634.917 111.167 716.333 96 797.75 83C879.167 70 960.583 57 1042 44C1120 35 1150 30 1150 30" 
            stroke="#8B5CF6" 
            strokeWidth="3"
            fill="none"
          />
          
          {/* Axes */}
          <g stroke="#9CA3AF">
            <path d="M65 265H1150" strokeWidth="2"/>
            <path d="M65 271V265" strokeWidth="2"/>
            <path d="M309.25 271V265" strokeWidth="2"/>
            <path d="M553.5 271V265" strokeWidth="2"/>
            <path d="M797.75 271V265" strokeWidth="2"/>
            <path d="M1042 271V265" strokeWidth="2"/>
            <path d="M1150 271V265" strokeWidth="2"/>
            <path d="M65 5V265" strokeWidth="2"/>
            <path d="M59 265H65" strokeWidth="2"/>
            <path d="M59 200H65" strokeWidth="2"/>
            <path d="M59 135H65" strokeWidth="2"/>
            <path d="M59 70H65" strokeWidth="2"/>
            <path d="M59 5H65" strokeWidth="2"/>
          </g>
          
          {/* Data points */}
          <g fill="#8B5CF6" stroke="#8B5CF6" strokeWidth="3">
            <circle cx="65" cy="187" r="5"/>
            <circle cx="309.25" cy="148" r="5"/>
            <circle cx="553.5" cy="122" r="5"/>
            <circle cx="797.75" cy="83" r="5"/>
            <circle cx="1042" cy="44" r="5"/>
            <circle cx="1150" cy="30" r="5"/>
          </g>
          
          {/* Y-axis labels */}
          <g fill="#9CA3AF" fontSize="12" fontFamily="Arial, sans-serif">
            <text x="45" y="270" textAnchor="end">0</text>
            <text x="45" y="205" textAnchor="end">25</text>
            <text x="45" y="140" textAnchor="end">50</text>
            <text x="45" y="75" textAnchor="end">75</text>
            <text x="45" y="10" textAnchor="end">100</text>
          </g>
          
          {/* X-axis labels */}
          <g fill="#9CA3AF" fontSize="12" fontFamily="Arial, sans-serif">
            <text x="65" y="290" textAnchor="middle">Jan</text>
            <text x="309.25" y="290" textAnchor="middle">Feb</text>
            <text x="553.5" y="290" textAnchor="middle">Mar</text>
            <text x="797.75" y="290" textAnchor="middle">Apr</text>
            <text x="1042" y="290" textAnchor="middle">May</text>
            <text x="1150" y="290" textAnchor="middle">Jun</text>
          </g>
        </svg>
      </div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl"></div>
    </div>
  );
};

export default ProgressChart;
