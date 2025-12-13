import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ProfileHeader,
  ProfilePhoto,
  BasicInformation,
  Bio,
  Certifications,
  CVUpload,
  ProfileActions
} from '../components/profile';

const Profile: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/mentor/dashboard');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0a0a1a,#1a1a2e_50%,#2a1a3e)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[-140px] left-[-124px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-purple-200/20 to-blue-200/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <ProfileHeader onBackToDashboard={handleBackToDashboard} />
        
        <div className="space-y-6">
          <ProfilePhoto />
          <BasicInformation />
          <Bio />
          <Certifications />
          <CVUpload />
          <ProfileActions />
        </div>
      </div>
    </div>
  );
};

export default Profile;