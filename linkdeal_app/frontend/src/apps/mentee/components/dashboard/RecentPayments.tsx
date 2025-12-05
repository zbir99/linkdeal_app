import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const RecentPayments: FunctionComponent = () => {
  const navigate = useNavigate();

  const payments = [
    {
      mentor: 'Marie Dupont',
      amount: '$400',
      time: '1h ago',
      type: 'paid'
    },
    {
      mentor: 'AI Coach',
      amount: 'free',
      time: '3h ago',
      type: 'free'
    },
    {
      mentor: 'John Smith',
      amount: '$329',
      time: '1d ago',
      type: 'paid'
    }
  ];

  return (
    <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.41699V26.5837" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 6.04199H9.5C8.57174 6.04199 7.6815 6.48756 7.02513 7.28069C6.36875 8.07381 6 9.14951 6 10.2712C6 11.3928 6.36875 12.4685 7.02513 13.2616C7.6815 14.0548 8.57174 14.5003 9.5 14.5003H14.5C15.4283 14.5003 16.3185 14.9459 16.9749 15.739C17.6313 16.5321 18 17.6078 18 18.7295C18 19.8511 17.6313 20.9268 16.9749 21.72C16.3185 22.5131 15.4283 22.9587 14.5 22.9587H6" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-lg font-semibold text-white">Recent Payments</h2>
        </div>
        <button
          onClick={() => navigate('/mentee/payment-history')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#7008E7] to-[#8E51FF] text-white text-sm font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200 whitespace-nowrap"
        >
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_508_1892_payment)">
              <path d="M0.693111 5.40003C0.638755 5.25477 0.638755 5.09498 0.693111 4.94974C1.22252 3.6764 2.12116 2.58767 3.27511 1.82157C4.42906 1.05547 5.78634 0.646484 7.17489 0.646484C8.56345 0.646484 9.92081 1.05547 11.0748 1.82157C12.2287 2.58767 13.1273 3.6764 13.6567 4.94974C13.7111 5.09498 13.7111 5.25477 13.6567 5.40003C13.1273 6.67335 12.2287 7.76211 11.0748 8.52819C9.92081 9.29427 8.56345 9.7033 7.17489 9.7033C5.78634 9.7033 4.42906 9.29427 3.27511 8.52819C2.12116 7.76211 1.22252 6.67335 0.693111 5.40003Z" stroke="white" strokeWidth="1.29918" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <g clipPath="url(#clip1_508_1892_payment)">
              <path d="M7.04258 6.81758C8.02289 6.81758 8.81754 6.02289 8.81754 5.04258C8.81754 4.06227 8.02289 3.26758 7.04258 3.26758C6.06227 3.26758 5.26758 4.06227 5.26758 5.04258C5.26758 6.02289 6.06227 6.81758 7.04258 6.81758Z" stroke="white" strokeWidth="1.18333" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_508_1892_payment">
                <rect width="14.675" height="10.675" fill="white" />
              </clipPath>
              <clipPath id="clip1_508_1892_payment">
                <rect width="5.325" height="5.325" fill="white" transform="translate(4.67578 2.67578)" />
              </clipPath>
            </defs>
          </svg>
          View All
        </button>
      </div>

      <div className="space-y-3">
        {payments.map((payment, index) => (
          <div
            key={index}
            className="rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col gap-1 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] transition-all duration-300 ease-out"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-white font-arimo">
                {payment.mentor}
              </h3>
              <span className="text-xs text-gray-500">
                {payment.time}
              </span>
            </div>
            <div className={`text-sm font-arimo ${payment.type === 'free' ? 'text-[#99A1AF]' : 'text-gray-300'}`}>
              {payment.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPayments;
