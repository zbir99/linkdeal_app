import { FunctionComponent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StarRating, FeedbackForm, ActionButtons } from '.';
import api from '@/services/api';

const RatingSession: FunctionComponent = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!sessionId) {
      console.error('No session ID found');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/scheduling/sessions/${sessionId}/rate/`, {
        rating,
        feedback
      });
      console.log('Rating submitted successfully');
      navigate('/mentee/dashboard');
    } catch (error) {
      console.error('Failed to submit rating:', error);
      // Optional: show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    console.log('Rating skipped');
    // Navigate to dashboard when skipped
    navigate('/mentee/dashboard');
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto text-white font-inter">
      <div className="absolute -top-10 -right-6 w-56 h-56 rounded-full bg-[#8033d0]/30 blur-[140px]" />
      <div className="absolute bottom-0 -left-10 w-64 h-64 rounded-full bg-[#0a203b]/40 blur-[160px]" />

      <div className="relative rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl px-6 sm:px-10 py-8 flex flex-col gap-6 shadow-2xl shadow-black/20 w-full">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-inter">Rate Your Session</h1>
          <p className="text-base text-gray-300 font-arimo">
            Help us improve by sharing your feedback
          </p>
        </div>

        {/* Rating Content */}
        <div className="flex flex-col gap-6 text-left text-sm text-gray-300 font-arimo">
          <StarRating rating={rating} onRatingChange={setRating} />

          <FeedbackForm feedback={feedback} onFeedbackChange={setFeedback} />

          <ActionButtons
            onSubmit={handleSubmit}
            onSkip={handleSkip}
            canSubmit={rating > 0 && !isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export { RatingSession };
