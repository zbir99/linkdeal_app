import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import MentorList from './components/MentorList'

function App() {
    const [mentorRecommendations, setMentorRecommendations] = useState(null)
    const [extractedProfile, setExtractedProfile] = useState(null)

    const handleRecommendations = (data) => {
        setExtractedProfile(data.extracted_profile)
        setMentorRecommendations(data.recommended_mentors)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                                LinkDeal
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Find Your Perfect Mentor with AI
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <span className="w-2 h-2 mr-2 bg-green-500 rounded-full animate-pulse" />
                                AI Ready
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Chat Interface */}
                    <div className="lg:col-span-1">
                        <ChatInterface onRecommendations={handleRecommendations} />
                    </div>

                    {/* Right: Recommendations */}
                    <div className="lg:col-span-1">
                        {mentorRecommendations && extractedProfile ? (
                            <MentorList
                                mentors={mentorRecommendations}
                                profile={extractedProfile}
                            />
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center">
                                        <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Your Mentor Recommendations Will Appear Here
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Start a conversation with our AI to get personalized mentor recommendations based on your goals and preferences.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-16 bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-sm text-gray-500">
                        © 2024 LinkDeal - Powered by AI & pgvector
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default App
