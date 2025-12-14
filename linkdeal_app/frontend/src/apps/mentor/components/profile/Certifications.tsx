import { FunctionComponent, useState } from 'react';

export const Certifications: FunctionComponent = () => {
<<<<<<< HEAD
  const [certifications, setCertifications] = useState<string[]>([]);
=======
  const [certifications, setCertifications] = useState<string[]>([
    'AWS Certified Developer',
    'MongoDB Professional'
  ]);
>>>>>>> de4e691e5d0f1d98f54b2aa5297cb850826e7810
  const [newCertification, setNewCertification] = useState('');
  const [certificationError, setCertificationError] = useState('');

  const addCertification = () => {
    const trimmedCert = newCertification.trim();
    
    if (!trimmedCert) {
      return;
    }

    if (certifications.includes(trimmedCert)) {
      setCertificationError("This certification has already been added");
      setTimeout(() => setCertificationError(""), 3000);
      return;
    }

    setCertifications([...certifications, trimmedCert]);
    setNewCertification('');
    setCertificationError('');
  };

  const removeCertification = (certToRemove: string) => {
    setCertifications(certifications.filter(cert => cert !== certToRemove));
    setCertificationError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addCertification();
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 min-h-[160px] max-h-[380px]">
      <style>{`
        .cert-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .cert-scrollbar::-webkit-scrollbar-track {
          background: rgba(112, 8, 231, 0.1);
          border-radius: 4px;
        }
        
        .cert-scrollbar::-webkit-scrollbar-thumb {
          background: #7008e7;
          border-radius: 4px;
        }
        
        .cert-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6007c5;
        }
      `}</style>
      
      <div className="flex items-center gap-2 mb-6">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_211_581)">
            <path d="M12.8973 10.7422L14.1598 17.8472C14.1739 17.9309 14.1622 18.0168 14.1261 18.0936C14.0901 18.1705 14.0315 18.2344 13.9581 18.277C13.8847 18.3196 13.8 18.3388 13.7155 18.3319C13.6309 18.3251 13.5504 18.2926 13.4848 18.2389L10.5015 15.9997C10.3574 15.8921 10.1825 15.834 10.0027 15.834C9.82294 15.834 9.64798 15.8921 9.50396 15.9997L6.51563 18.238C6.45006 18.2917 6.36968 18.3241 6.28521 18.331C6.20073 18.3378 6.11619 18.3187 6.04285 18.2762C5.9695 18.2338 5.91086 18.17 5.87473 18.0933C5.83859 18.0166 5.8267 17.9308 5.84063 17.8472L7.10229 10.7422" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 11.666C12.7614 11.666 15 9.42744 15 6.66602C15 3.90459 12.7614 1.66602 10 1.66602C7.23858 1.66602 5 3.90459 5 6.66602C5 9.42744 7.23858 11.666 10 11.666Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_211_581">
              <rect width="20" height="20" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        <h2 className="text-lg font-semibold text-white">Certifications</h2>
      </div>

      {certifications.length > 0 && (
        <div className="cert-scrollbar flex flex-col items-start gap-2 mb-4 flex-1 overflow-y-auto overflow-x-hidden pr-2 max-h-48">
          {certifications.map((cert, index) => (
            <div 
              key={`${cert}-${index}`} 
              className="flex min-h-[46.6px] items-center justify-between px-3 py-2 w-full bg-white/5 rounded-xl border border-white/10 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#7008e733] hover:to-[#8d51ff33] hover:border-[#7008e7] hover:shadow-lg hover:shadow-[#7008e7]/30"
            >
              <div className="flex-1 min-w-0 pr-2">
                <div className="text-white text-sm break-words">
                  {cert}
                </div>
              </div>

              <div 
                className="flex-shrink-0 w-4 h-4 cursor-pointer hover:bg-[#7008e750] rounded transition-colors"
                onClick={() => removeCertification(cert)}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {certificationError && (
          <div className="w-full px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-xs">
              {certificationError}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a certification..."
            className="flex-1 h-10 px-3 py-1 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:outline-none transition-all duration-300 focus:border-[#a683ff] focus:bg-white/10 hover:bg-white/10 hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20 placeholder-white/40"
          />

          <button 
            onClick={addCertification}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-[10px] transition-all duration-300 bg-[#7008e7] cursor-pointer hover:bg-[#6007c5] hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
