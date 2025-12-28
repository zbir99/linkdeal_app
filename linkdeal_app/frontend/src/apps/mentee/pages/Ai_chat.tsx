import { FunctionComponent, useState, useRef, useEffect } from 'react';
import { ChatSidebar, ChatHeader, ChatMessages, ChatInput, MatchingRecommendations } from '../components/ai_chat';
import api from '@/services/api';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  file?: {
    name: string;
    type: string;
    url: string;
  };
}

interface RecommendedMentor {
  id: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  languages: string[];
  session_rate: number;
  profile_picture_url?: string;
  match_reason: string;
}

interface ExtractedProfile {
  desired_skills?: string[];
  languages?: string[];
  experience_level?: string;
  goals?: string;
}

interface MenteeProfile {
  full_name: string;
  profile_picture?: string;
  interests?: string[];
}

const AiChat: FunctionComponent = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI coach at LinkDeal. I'm here to help you find the perfect mentor. What skills or areas would you like to develop?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() =>
    `session-${Date.now()}-${Math.random().toString(36).substring(7)}`
  );
  const [recommendedMentors, setRecommendedMentors] = useState<RecommendedMentor[]>([]);
  const [extractedProfile, setExtractedProfile] = useState<ExtractedProfile | null>(null);
  const [menteeProfile, setMenteeProfile] = useState<MenteeProfile | null>(null);
  const [isMobileRecsOpen, setIsMobileRecsOpen] = useState(false);
  const messageIdRef = useRef(2);

  // Fetch real mentee profile on mount
  useEffect(() => {
    const fetchMenteeProfile = async () => {
      try {
        const response = await api.get('auth/mentee/profile/me/');
        if (response.data) {
          // Try multiple sources for profile picture (matching backend field names)
          const profilePic = response.data.profile_picture_url  // serializer method field
            || response.data.profile_picture  // direct field
            || response.data.social_picture_url  // social auth picture
            || '';

          console.log('Mentee Profile Response:', response.data);
          console.log('Profile Picture URL:', profilePic);


          setMenteeProfile({
            full_name: response.data.full_name || response.data.user?.first_name || response.data.user?.name || '',
            profile_picture: profilePic,
            interests: response.data.skills || response.data.interests || []  // Use skills field from mentee profile
          });
        }
      } catch (error) {
        console.log('Could not fetch mentee profile:', error);
      }
    };
    fetchMenteeProfile();
  }, []);

  const handleSendMessage = async (text: string, file?: File) => {
    if (!text.trim() && !file) return;
    if (isLoading) return;

    // Add user message immediately
    const userMessage: Message = {
      id: messageIdRef.current++,
      text: text,
      sender: 'user',
      timestamp: new Date(),
      file: file ? {
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the AI chat API
      const response = await api.post('ai/chat/', {
        message: text,
        session_id: sessionId,
        get_recommendations: false
      });

      const { message, has_recommendations, recommended_mentors, extracted_profile, session_id: newSessionId } = response.data;

      // Update session ID if returned
      if (newSessionId) {
        setSessionId(newSessionId);
      }

      // Add AI response
      const aiResponse: Message = {
        id: messageIdRef.current++,
        text: message,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);

      // Handle mentor recommendations
      if (has_recommendations && recommended_mentors) {
        setRecommendedMentors(recommended_mentors);
      }

      // Store extracted profile
      if (extracted_profile) {
        setExtractedProfile(extracted_profile);
      }

    } catch (error) {
      console.error('Chat error:', error);

      // Add error message
      const errorMessage: Message = {
        id: messageIdRef.current++,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNewChat = () => {
    // Reset to new conversation
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI coach at LinkDeal. I'm here to help you find the perfect mentor. What skills or areas would you like to develop?",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    setSessionId(`session-${Date.now()}-${Math.random().toString(36).substring(7)}`);
    setRecommendedMentors([]);
    setExtractedProfile(null);
    messageIdRef.current = 2;
    closeSidebar();
  };

  const handleSelectChat = async (selectedSessionId: string) => {
    if (selectedSessionId === sessionId) {
      closeSidebar();
      return;
    }

    setIsLoading(true);
    try {
      // Fetch conversation history from API
      const response = await api.get(`ai/chat/${selectedSessionId}/`);
      const { messages: chatMessages } = response.data;

      // Convert API messages to our Message format
      const loadedMessages: Message[] = chatMessages.map((msg: { role: string; content: string; timestamp: string }, index: number) => ({
        id: index + 1,
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai',
        timestamp: new Date(msg.timestamp)
      }));

      setMessages(loadedMessages);
      setSessionId(selectedSessionId);
      messageIdRef.current = loadedMessages.length + 1;
      setRecommendedMentors([]);
      setExtractedProfile(null);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      setIsLoading(false);
      closeSidebar();
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative overflow-hidden flex">
      {/* Background Effects */}
      <div className="absolute bottom-0 left-0 w-96 h-96 [filter:blur(128px)] rounded-full bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none" />

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Left Sidebar - Chat History */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        currentSessionId={sessionId}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <ChatHeader onToggleSidebar={toggleSidebar} />

        {/* Messages */}
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          hasRecommendations={recommendedMentors.length > 0}
          onViewMentors={() => setIsMobileRecsOpen(true)}
        />

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>

      {/* Right Sidebar - Matching Recommendations */}
      <MatchingRecommendations
        mentors={recommendedMentors}
        extractedProfile={extractedProfile || undefined}
        isVisible={true}
        isMobileOpen={isMobileRecsOpen}
        onClose={() => setIsMobileRecsOpen(false)}
        userProfile={menteeProfile ? {
          name: menteeProfile.full_name,
          role: extractedProfile?.experience_level || '',
          interests: (menteeProfile.interests && menteeProfile.interests.length > 0) ? menteeProfile.interests : (extractedProfile?.desired_skills || []),
          profile_picture: menteeProfile.profile_picture
        } : undefined}
      />
    </div>
  );
};

export default AiChat;
