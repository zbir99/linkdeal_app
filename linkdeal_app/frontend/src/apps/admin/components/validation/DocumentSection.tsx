import { FunctionComponent } from 'react';

interface DocumentSectionProps {
  cvUrl?: string | null;
}

const DocumentSection: FunctionComponent<DocumentSectionProps> = ({ cvUrl }) => {
  if (!cvUrl) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white">Documents</h3>
        </div>
        <p className="text-white/50 text-sm">No documents uploaded.</p>
      </div>
    );
  }

  // Extract filename from URL or default
  const cvName = cvUrl.split('/').pop() || 'Mentor_CV.pdf';

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening in new tab
    if (!cvUrl) return;

    try {
      // Try to fetch as blob to force download
      const response = await fetch(cvUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = cvName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed, falling back to new tab:', error);
      // Fallback: just open in new tab if CORS/fetch fails
      window.open(cvUrl, '_blank');
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
      {/* Section Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-white">Documents</h3>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        <div
          className="rounded-lg border border-white/10 bg-white/5 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] cursor-pointer"
          onClick={() => window.open(cvUrl, '_blank')}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="text-white/60 flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="14,2 14,8 20,8" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="16" y1="13" x2="8" y2="13" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="16" y1="17" x2="8" y2="17" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="10,9 9,9 8,9" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate">{cvName}</p>
              <p className="text-white/50 text-xs">CV</p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="rounded-lg bg-white/10 p-2 hover:bg-white/20 transition-colors flex-shrink-0"
            title="Download"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="7,10 12,15 17,10" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="15" x2="12" y2="3" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentSection;
