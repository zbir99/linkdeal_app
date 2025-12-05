import { FunctionComponent } from 'react';

export const Bio: FunctionComponent = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Bio</h2>
      
      <div>
        <textarea
          rows={4}
          placeholder="Tell mentees about yourself..."
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200 resize-none"
        />
      </div>
    </div>
  );
};
