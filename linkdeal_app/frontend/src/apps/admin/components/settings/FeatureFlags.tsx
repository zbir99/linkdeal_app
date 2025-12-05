import { FunctionComponent, useState } from 'react';

interface FeatureFlag {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const FeatureFlags: FunctionComponent = () => {
  const [features, setFeatures] = useState<FeatureFlag[]>([
    {
      id: 'ai-coaching',
      title: 'AI Coaching',
      description: 'Enable AI-powered coaching assistant',
      enabled: true
    },
    {
      id: 'video-sessions',
      title: 'Video Sessions',
      description: 'Allow video conferencing for sessions',
      enabled: true
    },
    {
      id: 'project-review',
      title: 'Project Review',
      description: 'Enable project submission and review',
      enabled: true
    },
    {
      id: 'mentor-validation',
      title: 'Mentor Validation',
      description: 'Require admin approval for new mentors',
      enabled: true
    }
  ]);

  const handleToggle = (id: string) => {
    setFeatures(prev =>
      prev.map(feature =>
        feature.id === id
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    );
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
      <div className="p-6">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.99935 18.3334C7.78921 18.3334 5.6696 17.4554 4.10679 15.8926C2.54399 14.3298 1.66602 12.2102 1.66602 10.0001C1.66602 7.78994 2.54399 5.67033 4.10679 4.10752C5.6696 2.54472 7.78921 1.66675 9.99935 1.66675C12.2095 1.66675 14.3291 2.45692 15.8919 3.86345C17.4547 5.26997 18.3327 7.17762 18.3327 9.16675C18.3327 10.2718 17.8937 11.3316 17.1123 12.113C16.3309 12.8944 15.2711 13.3334 14.166 13.3334H12.291C12.0202 13.3334 11.7547 13.4088 11.5243 13.5512C11.2939 13.6936 11.1078 13.8973 10.9866 14.1396C10.8655 14.3818 10.8143 14.653 10.8386 14.9227C10.8629 15.1924 10.9619 15.4501 11.1243 15.6667L11.3743 16.0001C11.5368 16.2167 11.6358 16.4744 11.6601 16.7441C11.6844 17.0139 11.6332 17.285 11.5121 17.5273C11.3909 17.7695 11.2048 17.9732 10.9744 18.1156C10.744 18.258 10.4785 18.3334 10.2077 18.3334H9.99935Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.2507 5.83333C11.4808 5.83333 11.6673 5.64679 11.6673 5.41667C11.6673 5.18655 11.4808 5 11.2507 5C11.0205 5 10.834 5.18655 10.834 5.41667C10.834 5.64679 11.0205 5.83333 11.2507 5.83333Z" fill="#A684FF" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.5827 9.16659C14.8128 9.16659 14.9993 8.98004 14.9993 8.74992C14.9993 8.5198 14.8128 8.33325 14.5827 8.33325C14.3526 8.33325 14.166 8.5198 14.166 8.74992C14.166 8.98004 14.3526 9.16659 14.5827 9.16659Z" fill="#A684FF" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.41667 10.8333C5.64679 10.8333 5.83333 10.6468 5.83333 10.4167C5.83333 10.1865 5.64679 10 5.41667 10C5.18655 10 5 10.1865 5 10.4167C5 10.6468 5.18655 10.8333 5.41667 10.8333Z" fill="#A684FF" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.08268 6.66659C7.3128 6.66659 7.49935 6.48004 7.49935 6.24992C7.49935 6.0198 7.3128 5.83325 7.08268 5.83325C6.85256 5.83325 6.66602 6.0198 6.66602 6.24992C6.66602 6.48004 6.85256 6.66659 7.08268 6.66659Z" fill="#A684FF" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className="text-xl font-semibold text-white">Feature Flags</h2>
        </div>

        {/* Feature Toggles */}
        <div className="space-y-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex-1">
                <h3 className="text-white font-medium">{feature.title}</h3>
                <p className="text-white/60 text-sm mt-1">{feature.description}</p>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => handleToggle(feature.id)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-200 cursor-pointer ${
                  feature.enabled 
                    ? 'bg-purple-500 hover:bg-purple-600 hover:scale-110 hover:shadow-lg shadow-md' 
                    : 'bg-white/10 hover:bg-white/20 hover:scale-105'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    feature.enabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureFlags;
