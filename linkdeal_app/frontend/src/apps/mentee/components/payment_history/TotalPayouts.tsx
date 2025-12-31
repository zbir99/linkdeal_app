import { FunctionComponent } from 'react';

interface TotalPayoutsProps {
  totalAmount: string;
}

const TotalPayouts: FunctionComponent<TotalPayoutsProps> = ({ totalAmount }) => {
  const cards = [
    {
      label: 'Total Payouts',
      value: `$${totalAmount}`,
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12C0 5.37258 5.37258 0 12 0H36C42.6274 0 48 5.37258 48 12V36C48 42.6274 42.6274 48 36 48H12C5.37258 48 0 42.6274 0 36V12Z" fill="#7008E7" fillOpacity="0.2" />
          <path d="M19 19H29V29" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 29L29 19" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="group rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-8 flex items-center gap-3 shadow-lg shadow-black/20 w-full max-w-md transition-all duration-300 ease-out hover:scale-[1.02] hover:border-purple-400/30 hover:shadow-purple-500/20 hover:shadow-2xl hover:bg-white/10">
          <div className="flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3">
            {card.icon}
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-300 font-arimo transition-colors duration-300 group-hover:text-gray-200">{card.label}</p>
            <p className="text-lg font-semibold text-white transition-all duration-300 group-hover:text-purple-200 group-hover:scale-105">{card.value}</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5L12 9L8 13" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export { TotalPayouts };
