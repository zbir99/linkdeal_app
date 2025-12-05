import { FunctionComponent, useState, useEffect, useRef } from 'react';

export const HourlyRateSection: FunctionComponent = () => {
  const [hourlyRate, setHourlyRate] = useState('80');
  const [currency, setCurrency] = useState('EUR (€)');
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  const TrendIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.6667 4.66602H14.6667V8.66602" stroke="#C4B4FF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.6666 4.66602L8.99992 10.3327L5.66659 6.99935L1.33325 11.3327" stroke="#C4B4FF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(target)) {
        setCurrencyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCurrencyDropdownClick = () => {
    setCurrencyDropdownOpen(!currencyDropdownOpen);
  };

  const currencies = ['EUR (€)', 'USD ($)', 'GBP (£)', 'JPY (¥)', 'CAD ($)', 'AUD ($)', 'CHF (Fr)', 'CNY (¥)'];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
      <style>{`
        .dropdown-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .dropdown-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 3px;
        }
        
        .dropdown-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.6);
          border-radius: 3px;
        }
        
        .dropdown-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
        
        .dropdown-scrollbar::-webkit-scrollbar-corner {
          background: rgba(139, 92, 246, 0.1);
        }

        /* Hide default number input arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}</style>
      
      <h2 className="text-xl font-semibold text-white">Hourly Rate</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm text-white/70">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">€</span>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full h-12 pl-8 pr-16 bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] text-white placeholder-[#697282]/50 outline-none hover:bg-[#ffffff1a] hover:border-purple-400/50 transition-all duration-300 focus:text-white focus:bg-[#ffffff1a] focus:border-purple-400/50"
                placeholder="80"
              />
              {/* Custom increment/decrement buttons */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => setHourlyRate((prev) => String(Math.max(0, Number(prev) + 1)))}
                  className="w-8 h-4 flex items-center justify-center bg-white/10 hover:bg-purple-500/30 rounded-md transition-all duration-200 group"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9V3M3 6L6 3L9 6" stroke="#a0a0a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-purple-300 transition-colors"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setHourlyRate((prev) => String(Math.max(0, Number(prev) - 1)))}
                  className="w-8 h-4 flex items-center justify-center bg-white/10 hover:bg-purple-500/30 rounded-md transition-all duration-200 group"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 3V9M9 6L6 9L3 6" stroke="#a0a0a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-purple-300 transition-colors"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Currency Dropdown */}
          <div className="space-y-2">
            <label className="text-sm text-white/70">Currency</label>
            <div className="relative w-full" ref={currencyDropdownRef}>
              <div 
                className="flex h-9 items-center justify-between px-3 py-0 relative self-stretch w-full bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff1a] hover:border-purple-400/50 transition-all duration-300 group"
                onClick={handleCurrencyDropdownClick}
              >
                <div className="flex h-5 items-center gap-2 relative">
                  <div className="w-fit whitespace-nowrap relative mt-[-1.00px] text-[#a0a0a0] text-sm text-center tracking-[0] leading-5 group-hover:text-white transition-colors duration-300">
                    {currency}
                  </div>
                </div>
                <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className={`w-4 h-4 transition-transform duration-300 ${currencyDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {currencyDropdownOpen && (
                <div className="dropdown-scrollbar absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] shadow-xl z-10 max-h-48 overflow-y-auto">
                  <div className="py-1">
                    {currencies.map((curr) => (
                      <div
                        key={curr}
                        className="px-3 py-2 text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                        onClick={() => {
                          setCurrency(curr);
                          setCurrencyDropdownOpen(false);
                        }}
                      >
                        {curr}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-start gap-3 p-4 bg-[#7008E7]/10 border border-[#7008E7]/30 rounded-xl">
          <div className="flex-shrink-0 mt-0.5">
            <TrendIcon />
          </div>
          <p className="text-sm text-[#C4B4FF]">
            Recommended rate for your experience level: €70-100/hour
          </p>
        </div>
      </div>
    </div>
  );
};
