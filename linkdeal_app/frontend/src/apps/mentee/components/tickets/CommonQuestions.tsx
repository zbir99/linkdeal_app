import { FunctionComponent } from 'react';

const CommonQuestions: FunctionComponent = () => {
  const questions = [
    {
      question: "How do I reschedule a session?",
      answer: "Go to your dashboard and click on the session you want to reschedule"
    },
    {
      question: "What's your refund policy?",
      answer: "Full refund if cancelled 24 hours before the session"
    },
    {
      question: "How do I update my payment method?",
      answer: "Navigate to Settings → Billing to update your payment information"
    }
  ];

  return (
    <div className="rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl px-6 sm:px-10 py-8 space-y-6 text-white">
      <h2 className="text-2xl font-inter">Common Questions</h2>
      <div className="space-y-4 text-sm text-gray-200 font-arimo">
        {questions.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:border-white/30 transition-colors"
          >
            <p className="text-base font-semibold text-white">{item.question}</p>
            <p className="text-gray-400 mt-1">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { CommonQuestions };
