import { FunctionComponent } from 'react';

const QuickActions: FunctionComponent = () => {
  const actions = [
    {
      id: 1,
      title: 'Add a goal',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#A684FF" strokeWidth="2"/>
          <line x1="12" y1="8" x2="12" y2="16" stroke="#A684FF" strokeWidth="2"/>
          <line x1="8" y1="12" x2="16" y2="12" stroke="#A684FF" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Add context',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#A684FF" strokeWidth="2"/>
          <polyline points="14,2 14,8 20,8" stroke="#A684FF" strokeWidth="2"/>
          <line x1="16" y1="13" x2="8" y2="13" stroke="#A684FF" strokeWidth="2"/>
          <line x1="16" y1="17" x2="8" y2="17" stroke="#A684FF" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Load last mission',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#A684FF" strokeWidth="2"/>
          <polyline points="7,10 12,15 17,10" stroke="#A684FF" strokeWidth="2"/>
          <line x1="12" y1="15" x2="12" y2="3" stroke="#A684FF" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  return (
    <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md p-4 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-[#7008E7]/10 transition-all duration-500">
      <h3 className="text-lg text-white font-inter mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            className="group w-full rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center gap-4 p-4 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#7008E7]/20"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7008E7]/20 to-[#A684FF]/20 flex items-center justify-center group-hover:from-[#7008E7]/30 group-hover:to-[#A684FF]/30 transition-all duration-300 group-hover:scale-110">
              {action.icon}
            </div>
            <span className="text-sm text-white font-arimo group-hover:text-purple-200 transition-colors duration-300">{action.title}</span>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-300 ml-auto" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
