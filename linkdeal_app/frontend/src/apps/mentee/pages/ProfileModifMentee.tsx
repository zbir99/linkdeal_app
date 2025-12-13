import { FunctionComponent, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileModifMentee: FunctionComponent = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('Jean Dupont');
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [bio, setBio] = useState('Tell us a little about yourself...');
  const [skills, setSkills] = useState(['JavaScript', 'React', 'CSS']);
  const [newSkill, setNewSkill] = useState('');
  const [objectives, setObjectives] = useState([
    { id: 1, text: 'Mastering React', checked: false },
    { id: 2, text: 'Learn TypeScript', checked: false },
    { id: 3, text: 'Develop a portfolio', checked: false }
  ]);
  const [languages, setLanguages] = useState(['French', 'English']);
  const [newLanguage, setNewLanguage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    navigate('/mentee/profile');
  };

  const handleSave = () => {
    // Handle save logic here
    navigate('/mentee/profile');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleObjectiveToggle = (id: number) => {
    setObjectives(objectives.map(obj => 
      obj.id === id ? { ...obj, checked: !obj.checked } : obj
    ));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    setLanguages(languages.filter(language => language !== languageToRemove));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative">
      {/* Background Blur Effects */}
      <div className="hidden md:block">
        <div className="fixed top-[-216px] left-[204.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(233,212,255,0.2)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
        <div className="fixed top-[497px] left-[145.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
        <div className="fixed top-[28px] left-[637.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
      </div>

      {/* Additional background gradients for full coverage */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-0" />
      
      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-6">
            <button 
              onClick={handleBack}
              className="w-fit rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md px-4 py-2 text-sm text-gray-400 hover:bg-white/10 transition-all duration-300"
            >
              ← Back
            </button>
            <h1 className="text-3xl sm:text-4xl text-white font-inter">My Profile</h1>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Profile Section */}
            <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#7008E7] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {avatarImage ? (
                      <img src={avatarImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl text-white font-inter">JD</span>
                    )}
                  </div>
                  {/* Upload Icon */}
                  <button 
                    onClick={handleUploadClick}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#7008E7] flex items-center justify-center hover:bg-[#5a07b8] transition-all duration-300 cursor-pointer"
                  >
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="#7008E7"/>
                      <path d="M16 10V18" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19.3327 13.3333L15.9993 10L12.666 13.3333" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 18V20.6667C22 21.0203 21.8595 21.3594 21.6095 21.6095C21.3594 21.8595 21.0203 22 20.6667 22H11.3333C10.9797 22 10.6406 21.8595 10.3905 21.6095C10.1405 21.3594 10 21.0203 10 20.6667V18" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                
                {/* Name Field */}
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 font-arimo mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#A684FF] focus:bg-white/15 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
              <label className="block text-sm text-gray-400 font-arimo mb-4">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 h-32 text-white placeholder-gray-500 focus:outline-none focus:border-[#A684FF] focus:bg-white/15 transition-all duration-300 resize-none"
                placeholder="Tell us a little about yourself..."
              />
            </div>

            {/* Skills Section */}
            <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
              <label className="block text-sm text-gray-400 font-arimo mb-4">Skills</label>
              <div className="flex flex-col md:flex-row gap-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="flex-1 rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#A684FF] focus:bg-white/15 transition-all duration-300"
                  placeholder="Add skills....."
                />
                <button 
                  onClick={handleAddSkill}
                  className="rounded-lg bg-[#7008E7] text-white px-6 py-3 hover:bg-[#5a07b8] transition-all duration-300"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-lg bg-white/20 border border-white/30 text-xs text-white cursor-pointer hover:bg-[#7008E7]/20 hover:border-[#7008E7]/50 hover:shadow-lg hover:shadow-[#7008E7]/20 hover:scale-105 transition-all duration-300"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Objectives Section */}
            <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
              <label className="block text-sm text-gray-400 font-arimo mb-4">Objectifs</label>
              <div className="space-y-2">
                {objectives.map((objective) => (
                  <div 
                    key={objective.id}
                    onClick={() => handleObjectiveToggle(objective.id)}
                    className="rounded-lg bg-white/5 border border-white/20 px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-white/15 transition-all duration-300"
                  >
                    <div className={`w-6 h-6 rounded-full border-2 border-[#7008E7] flex items-center justify-center ${objective.checked ? 'bg-[#7008E7]' : ''}`}>
                      {objective.checked && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-white">{objective.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages Section */}
            <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
              <label className="block text-sm text-gray-400 font-arimo mb-4">Languages</label>
              <div className="flex flex-col md:flex-row gap-2 mb-4">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
                  className="flex-1 rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#A684FF] focus:bg-white/15 transition-all duration-300"
                  placeholder="Add language....."
                />
                <button 
                  onClick={handleAddLanguage}
                  className="rounded-lg bg-[#7008E7] text-white px-6 py-3 hover:bg-[#5a07b8] transition-all duration-300"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {languages.map((language, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-lg bg-[#7008E7] border border-[#A684FF] text-xs text-white cursor-pointer hover:bg-[#7008E7]/20 hover:border-[#7008E7]/50 hover:shadow-lg hover:shadow-[#7008E7]/20 hover:scale-105 transition-all duration-300"
                    onClick={() => handleRemoveLanguage(language)}
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button 
              onClick={handleSave}
              className="w-full rounded-lg bg-[#7008E7] text-white py-3 font-arimo hover:bg-[#5a07b8] transition-all duration-300 shadow-2xl shadow-[#7008E7]/40 hover:shadow-3xl hover:shadow-[#7008E7]/50 flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6667 2.5C13.1063 2.50626 13.5256 2.68598 13.8333 3L17 6.16667C17.314 6.47438 17.4937 6.89372 17.5 7.33333V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H12.6667Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.1673 17.4997V11.6663C14.1673 11.4453 14.0795 11.2334 13.9232 11.0771C13.767 10.9208 13.555 10.833 13.334 10.833H6.66732C6.4463 10.833 6.23434 10.9208 6.07806 11.0771C5.92178 11.2334 5.83398 11.4453 5.83398 11.6663V17.4997" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.83398 2.5V5.83333C5.83398 6.05435 5.92178 6.26631 6.07806 6.42259C6.23434 6.57887 6.4463 6.66667 6.66732 6.66667H12.5007" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModifMentee;
