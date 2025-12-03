import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionHistoryHeader, SessionCard } from '../components/session_history';

const SessionHistory: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/mentee/dashboard');
  };

  const sessions = [
    {
      id: 1,
      mentorName: 'Marie Dupont',
      mentorInitials: 'MD',
      topic: 'React Hooks Deep Dive',
      date: 'November 23, 2024',
      time: '2:00 PM - 3:00 PM',
      duration: '1 hour',
      price: '$400',
      rating: 5,
      status: 'Completed',
      feedback: 'Excellent session covering useState, useEffect, and custom hooks. Marie provided great examples and answered all my questions thoroughly.'
    },
    {
      id: 2,
      mentorName: 'John Smith',
      mentorInitials: 'JS',
      topic: 'JavaScript ES6+ Features',
      date: 'November 18, 2024',
      time: '10:00 AM - 11:30 AM',
      duration: '1.5 hours',
      price: '$329',
      rating: 4,
      status: 'Completed',
      feedback: 'Covered arrow functions, destructuring, spread operators, and promises. Very practical examples that I can use immediately.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="hidden md:block">
        <div className="fixed top-[-216px] left-[204.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(233,212,255,0.2)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
        <div className="fixed top-[497px] left-[145.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
        <div className="fixed top-[28px] left-[637.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
      </div>

      {/* Additional background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <SessionHistoryHeader onBack={handleBack} />

          {/* Session List */}
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 10V15" stroke="#A684FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M25 10V15" stroke="#A684FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M28.75 13.75H11.25C9.86929 13.75 8.75 14.8693 8.75 16.25V28.75C8.75 30.1307 9.86929 31.25 11.25 31.25H28.75C30.1307 31.25 31.25 30.1307 31.25 28.75V16.25C31.25 14.8693 30.1307 13.75 28.75 13.75Z" stroke="#A684FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.75 20H31.25" stroke="#A684FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl text-white font-semibold mb-2">No Sessions Yet</h3>
              <p className="text-sm sm:text-base text-gray-400 text-center max-w-md mb-6">
                You haven't completed any mentoring sessions yet. Once you complete a session, it will appear here.
              </p>
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#7008E7] to-[#8E51FF] text-white text-sm font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <SessionCard 
                  key={session.id} 
                  session={session}
                  onClick={() => console.log('Session clicked:', session.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;

