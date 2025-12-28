import { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/services/api';

export const VideoArea: FunctionComponent = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();

  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!sessionId) return;

      try {
        setLoading(true);
        // Get video room URL from backend
        // This will create a Whereby room if one doesn't exist
        const response = await api.get(`/scheduling/sessions/${sessionId}/video-room/`);

        if (response.data.room_url) {
          setRoomUrl(response.data.room_url);
        } else {
          setError('No video room URL returned');
        }
      } catch (err) {
        console.error('Failed to join video session:', err);
        setError('Failed to join video session. Please try again.');
        // Fallback or specific error handling could go here
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [sessionId]);

  const handleEndSession = () => {
    navigate(`/mentee/rate/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#0a0a1a]/50 p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-white text-xl animate-pulse">Connecting to secure video room...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-[#0a0a1a]/50 p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0a0a1a]/50 flex flex-col min-h-[400px] sm:min-h-[500px] lg:min-h-0 relative">
      {roomUrl ? (
        <iframe
          src={roomUrl}
          allow="camera; microphone; fullscreen; speaker; display-capture"
          className="w-full h-full border-0"
          style={{ minHeight: '100%' }}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-white/50">
          Initializing video...
        </div>
      )}

      {/* Overlay End Call Button (optional, Whereby has its own controls usually, 
          but usually we want a way to exit back to app) */}
      <div className="absolute bottom-4 left-4 z-50">
        <button
          onClick={handleEndSession}
          className="px-4 py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-lg shadow-lg backdrop-blur-sm transition-all text-sm font-medium flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.6663 1.33301L1.33301 14.6663" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.17301 9.05434C1.97034 7.14077 1.33253 4.92646 1.33301 2.66634C1.33301 2.31272 1.47348 1.97358 1.72353 1.72353C1.97358 1.47348 2.31272 1.33301 2.66634 1.33301H4.66634C5.01996 1.33301 5.3591 1.47348 5.60915 1.72353C5.8592 1.97358 5.99967 2.31272 5.99967 2.66634V4.66634C5.99967 4.87333 5.95148 5.07749 5.85891 5.26263C5.76634 5.44777 5.63194 5.60881 5.46634 5.73301L5.15434 5.96701C5.03195 6.06046 4.94569 6.1934 4.9102 6.34324C4.87472 6.49308 4.8922 6.65059 4.95967 6.78901C5.01189 6.89514 5.06613 7.00027 5.12234 7.10434" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Leave Call
        </button>
      </div>
    </div>
  );
};

export default VideoArea as FunctionComponent;

