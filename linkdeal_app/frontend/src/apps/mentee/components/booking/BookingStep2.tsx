import { FunctionComponent } from 'react';
import { useBooking } from '../../context/BookingContext';

interface BookingStep2Props {
  onContinue: () => void;
  onBack: () => void;
}

const BookingStep2: FunctionComponent<BookingStep2Props> = ({ onContinue, onBack }) => {
  const {
    cardNumber,
    cardName,
    expiryDate,
    cvv,
    setCardNumber,
    setCardName,
    setExpiryDate,
    setCvv
  } = useBooking();

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return digits.substring(0, 2) + '/' + digits.substring(2, 4);
    }
    return digits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    setCvv(digits.substring(0, 4));
  };

  const isFormValid = cardName.length > 0 &&
    cardNumber.replace(/\s/g, '').length === 16 &&
    expiryDate.length === 5 &&
    cvv.length >= 3;

  return (
    <div className="w-full flex flex-col items-start gap-8 mr-8 flex-1">
      {/* Title */}
      <div className="w-full h-9">
        <h2 className="text-[32px] font-inter text-white leading-9">Payment Information</h2>
      </div>

      {/* Card Details Form */}
      <div className="w-full flex flex-col items-start gap-6 flex-1">
        {/* Cardholder Name */}
        <div className="w-full flex flex-col items-start gap-2">
          <label className="text-[14px] font-arimo text-gray-400 leading-[21px]">Cardholder Name</label>
          <div className="w-full h-14 rounded-lg bg-white/5 border border-white/20 backdrop-blur-md overflow-hidden flex items-center px-4 py-2 text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
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
        <div className="w-full flex flex-col items-start gap-2">
          <label className="text-[14px] font-arimo text-gray-400 leading-[21px]">Card Number</label>
          <div className="w-full h-14 rounded-lg bg-white/5 border border-white/20 backdrop-blur-md overflow-hidden flex items-center px-4 py-2 text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              className="w-full bg-transparent outline-none text-[16px] font-arimo placeholder-gray-500"
            />
            <div className="flex gap-2 ml-2">
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="20" rx="4" fill="#1A1F71" />
                <path d="M13.2 13.5H11.4L12.6 6.5H14.4L13.2 13.5Z" fill="white" />
                <path d="M19.6 6.7C19.2 6.5 18.6 6.4 17.8 6.4C16 6.4 14.8 7.3 14.8 8.5C14.8 9.4 15.6 9.9 16.2 10.2C16.8 10.5 17 10.7 17 11C17 11.4 16.6 11.6 16 11.6C15.2 11.6 14.6 11.4 14.2 11.2L14 11.1L13.8 12.5C14.2 12.7 15 12.9 15.8 12.9C17.8 12.9 18.8 12 18.8 10.7C18.8 10 18.4 9.4 17.4 9C16.8 8.7 16.4 8.5 16.4 8.2C16.4 8 16.6 7.7 17.2 7.7C17.8 7.7 18.2 7.8 18.6 8L18.8 8.1L19 6.7H19.6Z" fill="white" />
              </svg>
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="20" rx="4" fill="#EB001B" fillOpacity="0.2" />
                <circle cx="12" cy="10" r="6" fill="#EB001B" />
                <circle cx="20" cy="10" r="6" fill="#F79E1B" />
              </svg>
            </div>
          </div>
        </div>

        {/* Expiry Date and CVV */}
        <div className="w-full flex gap-4">
          <div className="flex-1 flex flex-col items-start gap-2">
            <label className="text-[14px] font-arimo text-gray-400 leading-[21px]">Expiry Date</label>
            <div className="w-full h-14 rounded-lg bg-white/5 border border-white/20 backdrop-blur-md overflow-hidden flex items-center px-4 py-2 text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
              <input
                type="text"
                value={expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="w-full bg-transparent outline-none text-[16px] font-arimo placeholder-gray-500"
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-start gap-2">
            <label className="text-[14px] font-arimo text-gray-400 leading-[21px]">CVV</label>
            <div className="w-full h-14 rounded-lg bg-white/5 border border-white/20 backdrop-blur-md overflow-hidden flex items-center px-4 py-2 text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
              <input
                type="password"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                className="w-full bg-transparent outline-none text-[16px] font-arimo placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2 text-gray-500 text-[12px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Your payment information is secure and encrypted</span>
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
          disabled={!isFormValid}
          className={`h-12 flex-1 rounded-lg text-[14px] font-arimo text-white transition-all duration-300 flex items-center justify-center py-2 px-4 ${isFormValid
              ? 'bg-[#7008E7] hover:bg-[#5a07b8] shadow-lg shadow-[#7008E7]/30 hover:shadow-xl hover:shadow-[#7008E7]/50'
              : 'bg-gray-600 cursor-not-allowed'
            }`}
        >
          Review Booking
        </button>
      </div>
    </div>
  );
};

export default BookingStep2;
