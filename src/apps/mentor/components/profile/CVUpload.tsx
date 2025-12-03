import { FunctionComponent, useState, useRef, ChangeEvent } from 'react';

export const CVUpload: FunctionComponent = () => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string>("");
  const cvFileInputRef = useRef<HTMLInputElement>(null);

  const handleCvUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setCvError('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setCvError('File size must be less than 5MB');
      return;
    }

    // Clear any previous errors
    setCvError('');
    setCvFile(file);
  };

  const handleCvUploadClick = () => {
    cvFileInputRef.current?.click();
  };

  const handleRemoveCv = () => {
    setCvFile(null);
    setCvError('');
    if (cvFileInputRef.current) {
      cvFileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <input
        ref={cvFileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleCvUpload}
        className="hidden"
      />
      
      <div className="flex items-center gap-2 mb-6">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.6667 1.66602H5.00004C4.55801 1.66602 4.13409 1.84161 3.82153 2.15417C3.50897 2.46673 3.33337 2.89065 3.33337 3.33268V16.666C3.33337 17.1081 3.50897 17.532 3.82153 17.8445C4.13409 18.1571 4.55801 18.3327 5.00004 18.3327H15C15.4421 18.3327 15.866 18.1571 16.1786 17.8445C16.4911 17.532 16.6667 17.1081 16.6667 16.666V6.66602L11.6667 1.66602Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.6667 1.66602V6.66602H16.6667" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9.16602V14.166" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.5 11.666L10 9.16602L12.5 11.666" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 className="text-lg font-semibold text-white">Upload your CV</h2>
      </div>

      {cvFile ? (
        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/10 border border-white/20">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <p className="text-white text-sm">{cvFile.name}</p>
              <p className="text-white/50 text-xs">{(cvFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <button
            onClick={handleRemoveCv}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      ) : (
        <div 
          onClick={handleCvUploadClick}
          className="flex flex-col items-center justify-center px-4 py-12 rounded-lg bg-white/10 border border-white/20 cursor-pointer hover:bg-white/15 hover:border-purple-400/50 transition-all duration-200 group"
        >
          <div className="w-12 h-12 mb-4 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-200">
              <path d="M24 6V30" stroke="#A684FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M34 16L24 6L14 16" stroke="#A684FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M42 30V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V30" stroke="#A684FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-white text-sm mb-1">Click to upload or drag and drop</p>
          <p className="text-white/50 text-xs">PDF, DOC, DOCX (max 5MB)</p>
        </div>
      )}
      
      {cvError && (
        <p className="text-red-400 text-xs mt-2">{cvError}</p>
      )}
    </div>
  );
};

