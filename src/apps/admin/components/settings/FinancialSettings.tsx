import { FunctionComponent, useState } from 'react';

const FinancialSettings: FunctionComponent = () => {
  const [platformFee, setPlatformFee] = useState('10');
  const [minSessionPrice, setMinSessionPrice] = useState('50');

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden group hover:border-white/15 transition-all duration-300">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative p-6">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.66663V18.3333" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.1667 4.16663H7.91667C7.14312 4.16663 6.40125 4.47392 5.85427 5.0209C5.30729 5.56788 5 6.30974 5 7.08329C5 7.85684 5.30729 8.59871 5.85427 9.14569C6.40125 9.69267 7.14312 9.99996 7.91667 9.99996H12.0833C12.8569 9.99996 13.5987 10.3073 14.1457 10.8542C14.6927 11.4012 15 12.1431 15 12.9166C15 13.6902 14.6927 14.432 14.1457 14.979C13.5987 15.526 12.8569 15.8333 12.0833 15.8333H5" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-1">Financial Settings</h2>
            <p className="text-sm text-white/60">Configure platform fees and pricing structure</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Fee */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
              Platform Fee (%)
              <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse" />
            </label>
            <div className="relative">
              <input
                type="text"
                value={platformFee}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value === '' || !isNaN(Number(value))) {
                    setPlatformFee(value);
                  }
                }}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#7008E7] focus:outline-none focus:ring-2 focus:ring-[#7008E7]/20 transition-all duration-300 text-white placeholder:text-white/40 hover:bg-white/10 hover:border-white/20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 font-mono">%</div>
            </div>
            <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
                <path d="M6 3V6L8 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Commission charged per session
            </p>
          </div>

          {/* Min Session Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
              Min Session Price
              <div className="w-2 h-2 rounded-full bg-orange-500/50 animate-pulse" />
            </label>
            <div className="relative">
              <input
                type="text"
                value={minSessionPrice}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value === '' || !isNaN(Number(value))) {
                    setMinSessionPrice(value);
                  }
                }}
                placeholder="0"
                className="w-full px-4 py-3 pr-16 rounded-xl bg-white/5 border border-white/10 focus:border-[#7008E7] focus:outline-none focus:ring-2 focus:ring-[#7008E7]/20 transition-all duration-300 text-white placeholder:text-white/40 hover:bg-white/10 hover:border-white/20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setMinSessionPrice(String(parseInt(minSessionPrice) + 10))}
                  className="w-4 h-4 rounded bg-purple-500/20 hover:bg-purple-500/30 transition-colors flex items-center justify-center group"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 1L6 3L2 3L4 1Z" fill="#A684FF" className="group-hover:fill-purple-300 transition-colors"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setMinSessionPrice(String(Math.max(0, parseInt(minSessionPrice) - 10)))}
                  className="w-4 h-4 rounded bg-purple-500/20 hover:bg-purple-500/30 transition-colors flex items-center justify-center group"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 7L2 5L6 5L4 7Z" fill="#A684FF" className="group-hover:fill-purple-300 transition-colors"/>
                  </svg>
                </button>
              </div>
              <div className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-white/40 font-mono">€</div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 14L4 9L5.41 7.59L9 11.17L15.59 4.58L17 6L9 14Z" fill="#A684FF"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Revenue Model Active</h3>
                <p className="text-xs text-white/60">Platform fee: {platformFee}%</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-white">€{minSessionPrice}</div>
              <div className="text-xs text-white/60">Min Price</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSettings;
