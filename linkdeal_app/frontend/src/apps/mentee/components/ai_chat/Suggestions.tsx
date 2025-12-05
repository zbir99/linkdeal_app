import { FunctionComponent } from 'react';

const Suggestions: FunctionComponent = () => {
  const suggestions = [
    'How to get started with React?',
    'Create a professional portfolio',
    'Optimize my learning sessions',
    'Preparing for a technical interview'
  ];

  const handleSuggestionClick = (suggestion: string) => {
    console.log('Suggestion clicked:', suggestion);
    // Handle suggestion click
  };

  return (
    <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md p-4 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-[#7008E7]/10 transition-all duration-500">
      <h3 className="text-lg text-white font-inter mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Suggestions</h3>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="group w-full rounded-xl bg-gradient-to-r from-white/5 to-white/3 hover:from-white/10 hover:to-white/8 transition-all duration-300 p-4 text-left hover:scale-[1.02] hover:shadow-lg hover:shadow-[#7008E7]/20 border border-white/10 hover:border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#7008E7] to-[#A684FF] group-hover:scale-150 transition-all duration-300"></div>
              <p className="text-sm text-gray-300 font-arimo leading-5 group-hover:text-white transition-colors duration-300 flex-1">
                {suggestion}
              </p>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
