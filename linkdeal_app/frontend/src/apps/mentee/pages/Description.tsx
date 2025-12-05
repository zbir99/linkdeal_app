import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/description/BackButton.tsx';
import MentorProfile from '../components/description/MentorProfile.tsx';
import BookingCard from '../components/description/BookingCard.tsx';

const Description: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/mentee/find-mentor');
  };

  // Sample mentor data
  const mentorData = {
    name: 'Dr. Emily Chen',
    title: 'AI/ML Expert & Product Strategist',
    initials: 'EC',
    rating: 4.9,
    reviews: 127,
    bio: 'With over 10 years of experience in AI/ML and product strategy, I\'ve helped hundreds of entrepreneurs and professionals build successful tech products. My expertise spans machine learning, deep learning, natural language processing, and scaling AI systems.',
    experiences: [
      {
        title: 'Senior AI Researcher at TechCorp',
        company: 'TechCorp',
        period: '2018 - Present'
      },
      {
        title: 'ML Engineer at StartupHub',
        company: 'StartupHub', 
        period: '2015 - 2018'
      }
    ],
    skills: [
      'Machine Learning',
      'Deep Learning',
      'Python',
      'TensorFlow',
      'Product Strategy',
      'Data Science'
    ],
    reviewList: [
      {
        rating: 5,
        comment: 'Incredibly helpful session! Emily helped me structure my AI product roadmap and gave practical advice.',
        author: 'John D.',
        date: '2 weeks ago'
      },
      {
        rating: 5,
        comment: 'Incredibly helpful session! Emily helped me structure my AI product roadmap and gave practical advice.',
        author: 'John D.',
        date: '2 weeks ago'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative overflow-hidden">
      {/* Background Blur Effects - Desktop */}
      <div className="hidden lg:block">
        <div className="fixed top-[92px] left-[831.4px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
        <div className="fixed top-[428px] left-[179px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
        <div className="fixed top-[428px] left-[977px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
      </div>

      {/* Background Blur Effects - Mobile */}
      <div className="lg:hidden">
        <div className="absolute top-[428px] left-[179px] [filter:blur(96px)] rounded-full w-72 h-72 bg-gradient-to-br from-[rgba(128,51,208,0.35)] to-[rgba(10,32,59,0.35)] pointer-events-none z-0" />
        <div className="absolute top-[428px] right-[40px] [filter:blur(96px)] rounded-full w-64 h-64 bg-gradient-to-br from-[rgba(128,51,208,0.35)] to-[rgba(10,32,59,0.35)] pointer-events-none z-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-16 py-6">
        <div className="max-w-7xl mx-auto relative">
          {/* Back Button */}
          <div className="mb-6 lg:mb-0 flex justify-start lg:justify-start lg:absolute lg:top-8 lg:left-6">
            <BackButton onBack={handleBack} />
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8 pt-6 lg:pt-20">
            {/* Left Column - Mentor Details */}
            <div className="flex-1 flex justify-center lg:justify-start">
              <MentorProfile {...mentorData} />
            </div>

            {/* Right Column - Booking Card */}
            <div className="w-full lg:w-[304px] flex justify-center lg:block">
              <div className="w-full max-w-[360px] lg:max-w-none lg:sticky lg:top-24">
                <BookingCard 
                  price={150}
                  duration="60 minutes"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;