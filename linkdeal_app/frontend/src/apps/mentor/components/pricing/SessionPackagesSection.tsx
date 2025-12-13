import { FunctionComponent, useState } from 'react';

interface Package {
  id: number;
  title: string;
  sessions: number;
  price: string;
  discount?: string;
  description: string;
}

const PriceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_161_13724)">
      <path d="M8 1.33398V14.6673" stroke="#A684FF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.3333 3.33398H6.33333C5.71449 3.33398 5.121 3.57982 4.68342 4.0174C4.24583 4.45499 4 5.04848 4 5.66732C4 6.28616 4.24583 6.87965 4.68342 7.31723C5.121 7.75482 5.71449 8.00065 6.33333 8.00065H9.66667C10.2855 8.00065 10.879 8.24648 11.3166 8.68407C11.7542 9.12165 12 9.71515 12 10.334C12 10.9528 11.7542 11.5463 11.3166 11.9839C10.879 12.4215 10.2855 12.6673 9.66667 12.6673H4" stroke="#A684FF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_161_13724">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export const SessionPackagesSection: FunctionComponent = () => {
  const [packages, setPackages] = useState<Package[]>([
    {
      id: 1,
      title: 'Single Session',
      sessions: 1,
      price: '80',
      description: '1 hour mentoring session'
    },
    {
      id: 2,
      title: '5 Sessions Package',
      sessions: 5,
      price: '375',
      discount: '6% OFF',
      description: '5 hours of mentoring • Save on bulk booking'
    },
    {
      id: 3,
      title: '10 Sessions Package',
      sessions: 10,
      price: '720',
      discount: '10% OFF',
      description: '10 hours of mentoring • Best value'
    }
  ]);

  const handlePriceChange = (id: number, newPrice: string) => {
    setPackages(packages.map(pkg => 
      pkg.id === id ? { ...pkg, price: newPrice } : pkg
    ));
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 space-y-6">
      <h2 className="text-lg md:text-xl font-semibold text-white">Session Packages</h2>
      
      <div className="space-y-3 md:space-y-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 hover:bg-white/10 hover:border-purple-400/30 transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="text-sm md:text-base font-semibold text-white">{pkg.title}</h3>
                {pkg.discount && (
                  <span className="px-1.5 py-0.5 md:px-2 md:py-1 text-xs md:text-sm font-medium bg-green-500/20 border border-green-500/30 text-green-300 rounded-md inline-block w-fit">
                    {pkg.discount}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <PriceIcon />
                <input
                  type="number"
                  value={pkg.price}
                  onChange={(e) => handlePriceChange(pkg.id, e.target.value)}
                  className="w-20 h-8 md:w-24 md:h-9 px-2 md:px-3 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200 text-sm md:text-base"
                />
              </div>
            </div>
            
            <p className="text-xs md:text-sm text-white/60">{pkg.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
