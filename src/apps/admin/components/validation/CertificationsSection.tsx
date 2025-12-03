import { FunctionComponent } from 'react';

interface Certification {
  name: string;
  issuer: string;
  year: string;
  verified: boolean;
}

const CertificationsSection: FunctionComponent = () => {
  const certifications: Certification[] = [
    {
      name: 'React Expert Certification',
      issuer: 'Meta',
      year: '2023',
      verified: true,
    },
    {
      name: 'AWS Solutions Architect',
      issuer: 'Amazon',
      year: '2022',
      verified: true,
    },
    {
      name: 'Google Cloud Professional',
      issuer: 'Google',
      year: '2021',
      verified: true,
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
      {/* Section Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
          <path d="M12.8983 10.7417L14.1608 17.8467C14.1749 17.9304 14.1632 18.0163 14.1271 18.0932C14.0911 18.17 14.0324 18.2339 13.959 18.2765C13.8857 18.3191 13.801 18.3383 13.7164 18.3315C13.6319 18.3246 13.5514 18.2922 13.4858 18.2384L10.5024 15.9992C10.3584 15.8916 10.1835 15.8335 10.0037 15.8335C9.82391 15.8335 9.64896 15.8916 9.50494 15.9992L6.5166 18.2375C6.45104 18.2912 6.37065 18.3237 6.28618 18.3305C6.20171 18.3373 6.11716 18.3182 6.04382 18.2758C5.97048 18.2333 5.91183 18.1695 5.8757 18.0928C5.83957 18.0162 5.82768 17.9303 5.8416 17.8467L7.10327 10.7417" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 11.6667C12.7614 11.6667 15 9.42817 15 6.66675C15 3.90532 12.7614 1.66675 10 1.66675C7.23858 1.66675 5 3.90532 5 6.66675C5 9.42817 7.23858 11.6667 10 11.6667Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3 className="text-lg sm:text-xl font-semibold text-white">Certifications</h3>
      </div>

      {/* Certifications List */}
      <div className="space-y-3">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-sm sm:text-base text-white font-medium truncate">{cert.name}</h4>
              <p className="text-white/60 text-xs sm:text-sm">
                {cert.issuer} • {cert.year}
              </p>
            </div>
            
            {cert.verified && (
              <div className="rounded-lg px-2.5 sm:px-3 py-1 text-xs font-medium transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default border self-start sm:self-center flex-shrink-0"
                style={{
                  backgroundColor: '#00C95033',
                  borderColor: '#00C9504D',
                  color: '#05DF72'
                }}
              >
                Verified
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsSection;
