import { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/services/api'; // Ensure this path is correct
import MentorProfile from '../components/validation/MentorProfile';
import DocumentSection from '../components/validation/DocumentSection';
import ActionButtons from '../components/validation/ActionButtons';
import BiographySection from '../components/validation/BiographySection';
import SkillsSection from '../components/validation/SkillsSection';
import LanguagesSection from '../components/validation/LanguagesSection';
import RejectModal from '../components/validation/Rejectmodal';

// Define interface matching backend response
interface MentorDetail {
  id: string;
  full_name: string;
  email: string;
  professional_title: string;
  location: string;
  country: string;
  profile_picture_url?: string;
  cv_url?: string;
  bio: string;
  skills: string[];
  languages: string;
  status: string;
}

const Validation: FunctionComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [mentor, setMentor] = useState<MentorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);

  // Fetch mentor data
  useEffect(() => {
    const fetchMentor = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await api.get(`/auth/admin/mentors/${id}/`);
        setMentor(response.data);
      } catch (error) {
        console.error("Failed to fetch mentor details", error);
        // navigate('/admin/mentors'); // Optional: redirect on error
      } finally {
        setLoading(false);
      }
    };
    fetchMentor();
  }, [id]);

  const handleBackToList = () => {
    navigate('/admin/mentors');
  };

  const handleApprove = async () => {
    if (!id) return;
    setApproveLoading(true);
    try {
      await api.post(`/auth/admin/mentors/${id}/approve/`);
      console.log('Mentor approved');
      setShowSuccessMessage(true);

      // Hide success message and navigate back after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate('/admin/mentors');
      }, 2000);
    } catch (error) {
      console.error("Failed to approve mentor", error);
      alert("Failed to approve mentor. Please try again.");
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleCancelModal = () => {
    setShowRejectModal(false);
  };

  const handleSendRejectionEmail = async () => {
    if (!id) return;
    try {
      await api.post(`/auth/admin/mentors/${id}/reject/`);
      console.log('Rejection email sent (simulated via API)');
      setShowRejectModal(false);
      navigate('/admin/mentors');
    } catch (error) {
      console.error("Failed to reject mentor", error);
      alert("Failed to reject mentor. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A1A]">
        <p className="text-white text-lg animate-pulse">Loading mentor details...</p>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A1A]">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Mentor not found</p>
          <button onClick={handleBackToList} className="text-purple-400 hover:text-purple-300">Back to List</button>
        </div>
      </div>
    );
  }

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
                <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
              <MentorProfile
                name={mentor.full_name}
                professionalTitle={mentor.professional_title}
                email={mentor.email}
                location={mentor.location}
                profilePictureUrl={mentor.profile_picture_url}
                initials={mentor.full_name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
              />
              <DocumentSection cvUrl={mentor.cv_url} />
              <ActionButtons onApprove={handleApprove} onReject={handleReject} approveLoading={approveLoading} />
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <BiographySection bio={mentor.bio} />
              <SkillsSection skills={mentor.skills} />
              <LanguagesSection languages={mentor.languages} />
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