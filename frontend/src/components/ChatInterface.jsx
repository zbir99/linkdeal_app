import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const ChatInterface = ({ onRecommendations }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: "Hello! I'm your AI mentor matching assistant. Tell me about yourself and what you'd like to learn. When you're ready, just say 'show me recommendations' or click the button below!"
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId] = useState(`session-${Date.now()}`)
    const [messageCount, setMessageCount] = useState(0)
    const [pendingMentorMessageId, setPendingMentorMessageId] = useState(null)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e, forceRecommendations = false) => {
        if (e) e.preventDefault()

        const messageContent = forceRecommendations ? "Show me mentor recommendations" : input
        if (!messageContent.trim() || isLoading) return

        // Add user message immediately + optional placeholder
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: messageContent
        }
        const placeholderMessage = forceRecommendations
            ? {
                id: Date.now() + 1,
                type: 'ai',
                content: "🔍 I'm gathering the best mentors for you. This may take 10-15 seconds..."
            }
            : null

        setMessages(prev => {
            const next = [...prev, userMessage]
            if (placeholderMessage) next.push(placeholderMessage)
            return next
        })
        if (placeholderMessage) {
            setPendingMentorMessageId(placeholderMessage.id)
        }
        if (!forceRecommendations) setInput('')
        setIsLoading(true)

        try {
            const response = await axios.post('/api/chat/', {
                message: messageContent,
                session_id: sessionId,
                get_recommendations: forceRecommendations
            })

            const data = response.data
            setMessageCount(data.message_count || messageCount + 1)

            if (pendingMentorMessageId) {
                setMessages(prev => prev.filter(msg => msg.id !== pendingMentorMessageId))
                setPendingMentorMessageId(null)
            }

            // Add AI response
            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: data.message
            }
            setMessages(prev => [...prev, aiMessage])

            // If we got recommendations, pass to parent
            if (data.has_recommendations && data.recommended_mentors && onRecommendations) {
                onRecommendations(data)
            }

        } catch (error) {
            console.error('Error:', error)
            if (pendingMentorMessageId) {
                setMessages(prev => prev.filter(msg => msg.id !== pendingMentorMessageId))
                setPendingMentorMessageId(null)
            }
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: 'Sorry, I encountered an error. Please try again.'
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const requestRecommendations = () => {
        handleSubmit(null, true)
    }

    return (
        <div className="bg-white rounded-xl shadow-md flex flex-col border border-gray-100" style={{ height: '600px' }}>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-purple-50 rounded-t-xl">
                <h2 className="text-lg font-semibold text-gray-900">AI Mentor Assistant</h2>
                <p className="text-sm text-gray-600 mt-1">
                    Chat with me, then click "Get Recommendations" when ready
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={message.type === 'user' ? 'chat-message-user' : 'chat-message-ai'}>
                            {message.type === 'ai' && (
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mr-2">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">Career Coach</span>
                                </div>
                            )}
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="chat-message-ai">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={(e) => handleSubmit(e, false)} className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex flex-col space-y-3">
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Tell me what you want to learn..."
                            className="input-field flex-1"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <span>{isLoading ? 'Sending...' : 'Send'}</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Get Recommendations Button - visible after 3+ exchanged messages */}
                    {messageCount >= 3 && (
                        <button
                            type="button"
                            onClick={requestRecommendations}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>🎯 Get My Mentor Recommendations</span>
                        </button>
                    )}
                    {pendingMentorMessageId && (
                        <div className="flex items-center text-xs text-gray-500 gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                            <span>Searching for the best mentors... (10-15s)</span>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}

export default ChatInterface
