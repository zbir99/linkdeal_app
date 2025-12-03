import { FunctionComponent } from 'react';

interface BookingStep3Props {
  onContinue: () => void;
  onBack: () => void;
}

const BookingStep3: FunctionComponent<BookingStep3Props> = ({ onContinue, onBack }) => {
  const handleConfirmBooking = () => {
    // Handle booking confirmation logic here
    console.log('Booking confirmed!');
    onContinue(); // Call the onContinue prop to move to Step 4
  };

  return (
    <div className="w-full flex flex-col items-start gap-6 mr-8">
      {/* Title */}
      <div className="w-full h-[146.5px] flex flex-col items-center text-[24px] font-inter text-center">
        {/* Icon */}
        <div className="w-16 h-16 flex items-center justify-center mb-5">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32Z" fill="#00C950" fill-opacity="0.2"/>
            <path d="M42.6663 24L27.9997 38.6667L21.333 32" stroke="#05DF72" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        {/* Main Title */}
        <h2 className="text-[24px] font-inter text-white leading-9 mb-2">Confirm Your Booking</h2>
        
        {/* Subtitle */}
        <p className="text-[15px] font-arimo text-gray-400 leading-[22.5px]">Please review your booking details</p>
      </div>

      {/* Booking Details */}
      <div className="w-full flex flex-col items-start gap-4">
        {/* Date Card */}
        <div className="w-full h-[79.6px] rounded-lg bg-white/5 border border-white/20 backdrop-blur-md flex flex-col items-start pt-[16.8px] px-[16.8px] pb-[0.8px] gap-1">
          <div className="text-[12px] font-arimo text-gray-400 leading-[18px]">Date</div>
          <div className="text-[16px] font-inter text-white leading-6">Nov 26, 2024</div>
        </div>

        {/* Time Card */}
        <div className="w-full h-[79.6px] rounded-lg bg-white/5 border border-white/20 backdrop-blur-md flex flex-col items-start pt-[16.8px] px-[16.8px] pb-[0.8px] gap-1">
          <div className="text-[12px] font-arimo text-gray-400 leading-[18px]">Time</div>
          <div className="text-[16px] font-inter text-white leading-6">16:00</div>
        </div>

        {/* Topic Card */}
        <div className="w-full h-[79.6px] rounded-lg bg-white/5 border border-white/20 backdrop-blur-md flex flex-col items-start pt-[16.8px] px-[16.8px] pb-[0.8px] gap-1">
          <div className="text-[12px] font-arimo text-gray-400 leading-[18px]">Topic</div>
          <div className="text-[16px] font-inter text-white leading-6">bjj</div>
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
          onClick={handleConfirmBooking}
          className="h-12 flex-1 rounded-lg bg-[#7008E7] text-[14px] font-arimo text-white hover:bg-[#5a07b8] transition-all duration-300 shadow-lg shadow-[#7008E7]/30 hover:shadow-xl hover:shadow-[#7008E7]/50 flex items-center justify-center py-2 px-4"
        >
          Confirm & Pay €80
        </button>
      </div>
    </div>
  );
};

export default BookingStep3;
