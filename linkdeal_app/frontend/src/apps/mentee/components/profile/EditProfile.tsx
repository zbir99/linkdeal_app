import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

interface MenteeProfileData {
  full_name: string;
  email: string;
  profile_picture: string | null;
  social_picture_url: string | null;
  country: string;
  field_of_study: string;
  languages: string[];
  current_role: string | null;
  user_type: string;
  session_frequency: string;
}

const EditProfile: FunctionComponent = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MenteeProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('auth/mentee/profile/me/');
        setProfile(response.data);
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleModifyClick = () => {
    navigate('/mentee/profile-modif');
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
        <h2 className="text-2xl text-white font-inter mb-8">Edit Profile</h2>
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-2" />
              <div className="h-12 w-full bg-white/5 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
      <h2 className="text-2xl text-white font-inter mb-8">Edit Profile</h2>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm text-gray-400 font-arimo mb-2">Full Name</label>
          <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white">
            <span>{profile?.full_name || 'Not specified'}</span>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-400 font-arimo mb-2">Email</label>
          <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white">
            <span>{profile?.email || 'Not specified'}</span>
          </div>
        </div>

        {/* Country/Location */}
        <div>
          <label className="block text-sm text-gray-400 font-arimo mb-2">Location</label>
          <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white">
            <span>{profile?.country || 'Not specified'}</span>
          </div>
        </div>

        {/* Field of Study */}
        <div>
          <label className="block text-sm text-gray-400 font-arimo mb-2">Current Role</label>
          <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white">
            <span>{profile?.current_role || profile?.field_of_study || 'Not specified'}</span>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm text-gray-400 font-arimo mb-2">Bio</label>
          <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 h-24 text-white">
            <span>Passionate learner looking to grow my skills in {profile?.field_of_study || 'my field'}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleModifyClick}
          className="w-full rounded-lg bg-[#7008E7] text-white py-3 font-arimo hover:bg-[#5a07b8] transition-all duration-300 shadow-2xl shadow-[#7008E7]/40 hover:shadow-3xl hover:shadow-[#7008E7]/50"
        >
          Modify
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
