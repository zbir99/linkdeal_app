import { FunctionComponent } from 'react';

interface Document {
  name: string;
  size: string;
  type: string;
}

const DocumentSection: FunctionComponent = () => {
  const documents: Document[] = [
    { name: 'CV_Alexandre_Dubois.pdf', size: '245 KB', type: 'cv' },
    { name: 'Diplomas_Certifications.pdf', size: '1.2 MB', type: 'diploma' },
    { name: 'Cover_Letter.pdf', size: '156 KB', type: 'letter' },
  ];

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'cv':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="10,9 9,9 8,9" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'diploma':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="13,2 13,9 20,9" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
      {/* Section Header */}
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Documents</h3>

      {/* Documents List */}
      <div className="space-y-3">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="rounded-lg border border-white/10 bg-white/5 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="text-white/60 flex-shrink-0">
                {getDocumentIcon(doc.type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-medium truncate">{doc.name}</p>
                <p className="text-white/50 text-xs">{doc.size}</p>
              </div>
            </div>
            <button className="rounded-lg bg-white/10 p-2 hover:bg-white/20 transition-colors flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7,10 12,15 17,10" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentSection;
