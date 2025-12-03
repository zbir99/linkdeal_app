import { FunctionComponent } from 'react';

export const EarningsPreview: FunctionComponent = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.71835 10.2908C1.6489 10.1037 1.6489 9.89788 1.71835 9.71079C2.39476 8.07067 3.54294 6.66832 5.01732 5.68154C6.4917 4.69475 8.22588 4.16797 10 4.16797C11.7741 4.16797 13.5083 4.69475 14.9827 5.68154C16.4571 6.66832 17.6053 8.07067 18.2817 9.71079C18.3511 9.89788 18.3511 10.1037 18.2817 10.2908C17.6053 11.9309 16.4571 13.3333 14.9827 14.32C13.5083 15.3068 11.7741 15.8336 10 15.8336C8.22588 15.8336 6.4917 15.3068 5.01732 14.32C3.54294 13.3333 2.39476 11.9309 1.71835 10.2908Z" stroke="#A684FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#A684FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 className="text-lg font-semibold text-white">Preview</h2>
      </div>
      
      <div className="space-y-3">
        {/* Platform Fee */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-lg">
          <span className="text-sm text-white/70">Platform Fee (10%)</span>
          <span className="text-base font-semibold text-white">€8.00</span>
        </div>
        
        {/* Your Earnings */}
        <div className="flex items-center justify-between px-4 py-4 bg-[#7008E7]/10 border border-[#7008E7]/30 rounded-lg">
          <span className="text-sm text-[#A684FF] font-medium">You Earn per Session</span>
          <span className="text-lg font-bold text-[#A684FF]">€72.00</span>
        </div>
      </div>
    </div>
  );
};
