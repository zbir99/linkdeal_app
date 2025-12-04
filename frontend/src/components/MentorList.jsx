const MentorList = ({ mentors, profile }) => {
    // Helper to parse skills/languages that might be JSON strings
    const parseArray = (value) => {
        if (Array.isArray(value)) return value
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value)
                return Array.isArray(parsed) ? parsed : []
            } catch {
                return []
            }
        }
        return []
    }

    const getConfidenceBadgeColor = (confidence) => {
        switch (confidence) {
            case 'very_high':
                return 'bg-green-100 text-green-800'
            case 'high':
                return 'bg-blue-100 text-blue-800'
            case 'medium':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getConfidenceLabel = (confidence) => {
        switch (confidence) {
            case 'very_high':
                return 'Excellent Match'
            case 'high':
                return 'Great Match'
            case 'medium':
                return 'Good Match'
            default:
                return 'Potential Match'
        }
    }

    return (
        <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-6 border border-primary-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Profile</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600 mb-1">Desired Skills:</p>
                        <div className="flex flex-wrap gap-1">
                            {profile.desired_skills?.map((skill, idx) => (
                                <span key={idx} className="inline-block px-2 py-1 bg-white rounded text-xs font-medium text-primary-700">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-600 mb-1">Languages:</p>
                        <div className="flex flex-wrap gap-1">
                            {profile.languages?.map((lang, idx) => (
                                <span key={idx} className="inline-block px-2 py-1 bg-white rounded text-xs font-medium text-purple-700">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-2">
                        <p className="text-gray-600 mb-1">Experience Level:</p>
                        <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 capitalize">
                            {profile.experience_level || 'Not specified'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Mentor Cards */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Recommended Mentors ({mentors.length})
                </h3>

                <div className="space-y-4">
                    {mentors.map((mentor, index) => (
                        <div key={mentor.id} className="mentor-card">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                            {mentor.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">{mentor.name}</h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <span>{mentor.experience_years} years exp</span>
                                                <span>•</span>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="font-medium">{(mentor.rating || 0).toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Confidence Badge */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getConfidenceBadgeColor(mentor.confidence)}`}>
                                            {getConfidenceLabel(mentor.confidence)}
                                        </span>
                                        {mentor.similarity_score && (
                                            <span className="text-xs text-gray-500">
                                                {(mentor.similarity_score * 100).toFixed(0)}% match
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <p className="text-gray-700 text-sm mb-4 leading-relaxed">{mentor.bio}</p>

                            {/* Skills */}
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {parseArray(mentor.skills).map((skill, idx) => (
                                        <span key={idx} className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Languages */}
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Languages</p>
                                <div className="flex flex-wrap gap-2">
                                    {parseArray(mentor.languages).map((lang, idx) => (
                                        <span key={idx} className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* AI Explanation */}
                            {mentor.explanation && (
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                                    <div className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="text-xs font-semibold text-blue-900 mb-1">Why this mentor?</p>
                                            <p className="text-sm text-blue-800">{mentor.explanation}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Availability */}
                            {mentor.availability && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-600">
                                        <span className="font-semibold">Availability:</span> {mentor.availability}
                                    </p>
                                </div>
                            )}

                            {/* Action Button */}
                            <button className="mt-4 w-full btn-primary">
                                Connect with {mentor.name.split(' ')[0]}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MentorList
