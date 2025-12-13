import { FunctionComponent, useState } from 'react';
import { ChatMessages } from './index';

type TabType = 'chat' | 'notes' | 'files';

export const Sidebar: FunctionComponent = () => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  return (
    <div className="w-full lg:w-96 xl:w-[400px] flex flex-col bg-[#0a0a1a]/50 border-t lg:border-t-0 lg:border-l border-white/10 min-h-[300px] sm:min-h-[400px] lg:min-h-0">
      {/* Tabs */}
      <div className="flex border-b border-white/10 shrink-0">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 ${
            activeTab === 'chat'
              ? 'bg-white/10 text-white border-b-2 border-purple-500'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 ${
            activeTab === 'notes'
              ? 'bg-white/10 text-white border-b-2 border-purple-500'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          Notes
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 ${
            activeTab === 'files'
              ? 'bg-white/10 text-white border-b-2 border-purple-500'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          Files
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && <ChatMessages />}
        {activeTab === 'notes' && (
          <div className="h-full p-3 sm:p-4 text-white/60 text-xs sm:text-sm">Notes section coming soon...</div>
        )}
        {activeTab === 'files' && (
          <div className="h-full p-3 sm:p-4 text-white/60 text-xs sm:text-sm">Files section coming soon...</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar as FunctionComponent;
