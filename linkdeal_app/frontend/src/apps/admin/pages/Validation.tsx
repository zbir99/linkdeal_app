import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MentorProfile from '../components/validation/MentorProfile';
import DocumentSection from '../components/validation/DocumentSection';
import ActionButtons from '../components/validation/ActionButtons';
import BiographySection from '../components/validation/BiographySection';
import SkillsSection from '../components/validation/SkillsSection';
import CertificationsSection from '../components/validation/CertificationsSection';
import ExperienceSection from '../components/validation/ExperienceSection';
import EducationSection from '../components/validation/EducationSection';
import RejectModal from '../components/validation/Rejectmodal';

const Validation: FunctionComponent = () => {
  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleBackToList = () => {
    navigate('/admin/mentors');
  };

  const handleApprove = () => {
    console.log('Mentor approved');
    setShowSuccessMessage(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleReject = () => {
    console.log('Show reject modal');
    setShowRejectModal(true);
  };

  const handleCancelModal = () => {
    setShowRejectModal(false);
  };

  const handleSendRejectionEmail = () => {
    console.log('Rejection email sent');
    setShowRejectModal(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A0A1A 0%, #1A1A2E 50%, #2A1A3E 100%)' }}>
      {/* Decorative Blur Circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/20 [filter:blur(128px)] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-br from-purple-500/25 to-indigo-600/20 [filter:blur(128px)] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[25rem] h-[25rem] rounded-full bg-purple-600/20 [filter:blur(128px)] pointer-events-none hidden lg:block" />

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-50 animate-fade-in">
          <div className="bg-green-500/20 border border-green-500/40 rounded-xl px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-2 sm:gap-3 backdrop-blur-sm shadow-lg">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-green-400 font-medium text-sm sm:text-base">Mentor accepted successfully!</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6 md:space-y-8">
          {/* Header */}
          <div className="space-y-4 sm:space-y-6">
            {/* Back Button */}
            <button
              onClick={handleBackToList}
              className="h-9 sm:h-10 rounded-lg bg-white/5 border border-white/10 px-3 sm:px-4 text-xs sm:text-sm text-white/70 font-medium transition-colors hover:bg-white/10 hover:text-white hover:border-white/20 active:scale-95"
            >
              ← Back to List
            </button>
            
            {/* Page Title */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-tight">
                Mentor Validation
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-white/60">
                Review and validate mentor application
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Profile, Documents, Actions */}
            <div className="space-y-4 sm:space-y-6">
              <MentorProfile />
              <DocumentSection />
              <ActionButtons onApprove={handleApprove} onReject={handleReject} />
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <BiographySection />
              <SkillsSection />
              <CertificationsSection />
              <ExperienceSection />
              <EducationSection />
            </div>
          </div>
        </div>
      </div>
      
      {/* Reject Modal */}
      {showRejectModal && (
        <RejectModal 
          onCancel={handleCancelModal}
          onSendEmail={handleSendRejectionEmail}
        />
      )}
    </div>
  );
};

export default Validation;