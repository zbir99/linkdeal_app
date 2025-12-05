import { FunctionComponent, useState } from 'react';

interface BookingStep2Props {
  onContinue: () => void;
  onBack: () => void;
}

const BookingStep2: FunctionComponent<BookingStep2Props> = ({ onContinue, onBack }) => {
  const [cardNumber, setCardNumber] = useState('1234 5678 9012 3456');
  const [cardName, setCardName] = useState('John Doe');
  const [expiryDate, setExpiryDate] = useState('MM/YY');
  const [cvv, setCvv] = useState('123');

  return (
    <div className="w-full flex flex-col items-start gap-8 mr-8 flex-1">
      {/* Title */}
      <div className="w-full h-9">
        <h2 className="text-[32px] font-inter text-white leading-9">Payment Information</h2>
      </div>

      {/* Card Details Form */}
      <div className="w-full flex flex-col items-start gap-8 flex-1">
        {/* Cardholder Name */}
        <div className="w-full h-[100px] flex flex-col items-start gap-3">
          <label className="text-[16px] font-arimo text-gray-400 leading-[24px]">Cardholder Name</label>
          <div className="w-full h-16 rounded-lg bg-white/5 border border-white/20 backdrop-blur-md overflow-hidden flex items-center px-4 py-2 text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-transparent outline-none text-[16px] font-arimo placeholder-gray-500"
            />
          </div>
        </div>

        {/* Card Number */}
        <div className="w-full h-[100px] flex flex-col items-start gap-3">
          <label className="text-[16px] font-arimo text-gray-400 leading-[24px]">Card Number</label>
          <div className="w-full h-16 rounded-lg bg-white/5 border border-white/20 backdrop-blur-md overflow-hidden flex items-center px-4 py-2 text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="w-full bg-transparent outline-none text-[16px] font-arimo placeholder-gray-500"
            />
          </div>
        </div>

        {/* Expiry Date and CVV */}
        <div className="w-full flex gap-6">
          <div className="flex-1 h-[100px] flex flex-col items-start gap-3">
            <label className="text-[16px] font-arimo text-gray-400 leading-[24px]">Expiry Date</label>
            <div className="w-full h-16 rounded-lg bg-white/5 border border-white/20 backdrop-blur-md overflow-hidden flex items-center px-4 py-2 text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                className="w-full bg-transparent outline-none text-[16px] font-arimo placeholder-gray-500"
              />
            </div>
          </div>
          <div className="flex-1 h-[100px] flex flex-col items-start gap-3">
            <label className="text-[16px] font-arimo text-gray-400 leading-[24px]">CVV</label>
            <div className="w-full h-16 rounded-lg bg-white/5 border border-white/20 backdrop-blur-md overflow-hidden flex items-center px-4 py-2 text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                className="w-full bg-transparent outline-none text-[16px] font-arimo placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full h-12 flex items-start gap-4">
        <button 
          onClick={onBack}
          className="h-12 flex-1 rounded-lg bg-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center py-2 px-4 text-[14px] font-arimo text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          className="h-12 flex-1 rounded-lg bg-[#7008E7] text-[14px] font-arimo text-white hover:bg-[#5a07b8] transition-all duration-300 shadow-lg shadow-[#7008E7]/30 hover:shadow-xl hover:shadow-[#7008E7]/50 flex items-center justify-center py-2 px-4"
        >
          Review Booking
        </button>
      </div>
    </div>
  );
};

export default BookingStep2;
