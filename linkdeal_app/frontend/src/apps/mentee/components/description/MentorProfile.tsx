import { FunctionComponent } from 'react';



interface Review {
  rating: number;
  comment: string;
  author: string;
  date: string;
}

interface MentorProfileProps {
  name: string;
  title: string;
  initials: string;
  profilePicture?: string | null;
  rating: number;
  reviews: number;
  bio: string;
  skills: string[];
  reviewList: Review[];
}

const EmptySection = ({ title, message, icon, gradient }: { title: string, message: string, icon?: React.ReactNode, gradient?: string }) => (
  <div className="w-full flex flex-col items-start gap-4">
    <div className="text-white text-[24px] sm:text-[27px] font-inter font-semibold tracking-tight flex items-center gap-3">
      {icon && <span className="text-[#A684FF]">{icon}</span>}
      {title}
    </div>
    <div className={`w-full rounded-xl bg-gradient-to-br ${gradient || 'from-white/5 to-white/[0.02]'} border border-white/10 p-8 sm:p-10 flex flex-col items-center justify-center text-center gap-4 backdrop-blur-md transition-all duration-300 hover:border-white/20 group relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient || 'from-white/5 to-transparent'} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-all duration-300 ring-1 ring-white/10 group-hover:scale-110">
        {icon || (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/40 group-hover:text-white/60 transition-colors">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-white/60 text-base font-medium font-arimo group-hover:text-white/80 transition-colors">{message}</p>
        <p className="text-white/30 text-xs">This information hasn't been added yet</p>
      </div>
    </div>
  </div>
);

const MentorProfile: FunctionComponent<MentorProfileProps> = ({
  name,
  title,
  initials,
  profilePicture,
  rating,
  reviews,
  bio,
  skills,
  reviewList
}) => {
  return (
    <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md w-full lg:w-[90%] h-auto flex flex-col items-start pt-8 pb-8 px-6 sm:px-8 gap-10 lg:gap-12 mx-auto">
      {/* Header Section */}
      <div className="w-full flex flex-col gap-6 sm:flex-row sm:items-center">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={name}
            className="h-24 w-24 rounded-full object-cover hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-[#7008E7]/50"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-[#7008E7] flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-[#7008E7]/50">
            <div className="text-white text-[32px] font-inter leading-[32px] flex items-center justify-center h-full w-full">
              {initials}
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col items-start gap-2 text-[16px] font-arimo w-full">
          <div className="text-white text-3xl sm:text-4xl lg:text-[48px] font-inter leading-tight">
            {name}
          </div>
          <div className="text-[#A684FF] leading-6">{title}</div>
          <div className="flex flex-wrap items-center gap-4 w-full">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FBBF24" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-white text-base font-inter leading-6">{rating}</div>
              <div className="text-[14px] text-gray-400 leading-[21px]">
                ({reviews} reviews)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      {bio ? (
        <div className="w-full flex flex-col items-start gap-3">
          <div className="text-white text-[27px] font-inter leading-[27px] flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#A684FF]">
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Bio
          </div>
          <p className="text-[14px] text-gray-400 font-arimo leading-[22.75px]">
            {bio}
          </p>
        </div>
      ) : (
        <EmptySection
          title="Bio"
          message="No bio available yet."
          gradient="from-[#7008E7]/10 to-purple-500/10"
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      )}



      {/* Skills Section */}
      {skills && skills.length > 0 ? (
        <div className="w-full flex flex-col items-start gap-3">
          <div className="text-white text-[27px] font-inter leading-[27px] flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#A684FF]">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Skills
          </div>
          <div className="w-full text-[12px] font-arimo">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-2 rounded-lg bg-[#7008E7]/20 border border-[#7008E7]/40 text-white font-arimo transition-all duration-300 hover:bg-[#7008E7]/30 hover:border-[#7008E7]/60 hover:scale-105 hover:shadow-lg hover:shadow-[#7008E7]/20 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptySection
          title="Skills"
          message="No skills listed yet."
          gradient="from-[#7008E7]/10 to-purple-500/10"
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      )}

      {/* Reviews Section */}
      {reviewList && reviewList.length > 0 ? (
        <div className="w-full flex flex-col items-start gap-3">
          <div className="text-white text-[27px] font-inter leading-[27px] flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#A684FF]">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Reviews
          </div>
          <div className="w-full flex flex-col items-start gap-3 text-[14px] text-gray-400 font-arimo">
            {reviewList.map((review, index) => (
              <div key={index} className="w-full rounded-lg bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md flex flex-col items-start p-4 gap-2 transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10 cursor-pointer">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, starIndex) => (
                    <svg
                      key={starIndex}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill={starIndex < review.rating ? "#FBBF24" : "#374151"}
                        stroke={starIndex < review.rating ? "#FBBF24" : "#374151"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ))}
                </div>
                <p className="leading-[21px] w-full">"{review.comment}"</p>
                <div className="text-[12px] text-gray-500 leading-[18px]">
                  - {review.author}, {review.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptySection
          title="Reviews"
          message="No reviews yet."
          gradient="from-[#7008E7]/10 to-purple-500/10"
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      )}
    </div>
  );
};

export default MentorProfile;
