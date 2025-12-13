import { FunctionComponent } from 'react';

interface FeedbackFormProps {
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
}

const FeedbackForm: FunctionComponent<FeedbackFormProps> = ({ feedback, onFeedbackChange }) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="text-base text-white font-inter">Share your experience (optional)</div>
      <div className="relative rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20">
        <textarea
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
          placeholder="Tell us about your session..."
          className="w-full min-h-[120px] bg-transparent px-4 py-3 text-gray-200 placeholder:text-gray-500 resize-none focus:outline-none focus:border-transparent transition-all duration-300"
          rows={4}
        />
      </div>
    </div>
  );
};

export { FeedbackForm };
