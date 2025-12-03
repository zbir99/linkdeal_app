import { FunctionComponent, useState } from 'react';

export const SkillsExpertise: FunctionComponent = () => {
  const [skills, setSkills] = useState(['React', 'Node.js', 'TypeScript', 'MongoDB']);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Skills & Expertise</h2>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((skill) => (
          <div
            key={skill}
            className="px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm flex items-center gap-2 hover:bg-purple-500/30 hover:border-purple-500/40 hover:text-purple-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform cursor-pointer"
          >
            <span>{skill}</span>
            <button
              onClick={() => removeSkill(skill)}
              className="text-purple-400 hover:text-red-400 hover:scale-125 transition-all duration-200"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          placeholder="Add a skill..."
          className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
        />
        <button
          onClick={addSkill}
          className="px-4 py-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 hover:border-purple-500/40 hover:text-purple-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform"
        >
          Add
        </button>
      </div>
    </div>
  );
};
