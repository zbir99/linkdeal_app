import { FunctionComponent } from 'react';

interface Experience {
  title: string;
  company: string;
  period: string;
}

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
  rating: number;
  reviews: number;
  bio: string;
  experiences: Experience[];
  skills: string[];
  reviewList: Review[];
}

const MentorProfile: FunctionComponent<MentorProfileProps> = ({
  name,
  title,
  initials,
  rating,
  reviews,
  bio,
  experiences,
  skills,
  reviewList
}) => {
  return (
    <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md w-full lg:w-[90%] h-auto lg:min-h-[1011px] flex flex-col items-start pt-8 pb-8 px-6 sm:px-8 gap-10 lg:gap-12 mx-auto">
      {/* Header Section */}
      <div className="w-full flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="h-24 w-24 rounded-full bg-[#7008E7] flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-[#7008E7]/50">
          <div className="text-white text-[32px] font-inter leading-[32px] flex items-center justify-center h-full w-full">
            {initials}
          </div>
        </div>
        <div className="flex-1 flex flex-col items-start gap-2 text-[16px] font-arimo w-full">
          <div className="text-white text-3xl sm:text-4xl lg:text-[48px] font-inter leading-tight">
            {name}
          </div>
          <div className="text-[#A684FF] leading-6">{title}</div>
          <div className="flex flex-wrap items-center gap-4 w-full">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FBBF24" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
      <div className="w-full flex flex-col items-start gap-3">
        <div className="text-white text-[27px] font-inter leading-[27px]">Bio</div>
        <p className="text-[14px] text-gray-400 font-arimo leading-[22.75px]">
          {bio}
        </p>
      </div>

      {/* Experience Section */}
      <div className="w-full flex flex-col items-start gap-3">
        <div className="text-white text-[27px] font-inter leading-[27px]">Experience</div>
        <div className="w-full flex flex-col items-start gap-3 text-[16px] font-arimo">
          {experiences.map((experience, index) => (
            <div key={index} className="w-full rounded-lg bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md flex flex-col items-start p-4 gap-1 transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10 cursor-pointer">
              <div className="text-white leading-6">{experience.title}</div>
              <div className="text-[14px] text-gray-400 leading-[21px]">{experience.period}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div className="w-full flex flex-col items-start gap-3">
        <div className="text-white text-[27px] font-inter leading-[27px]">Skills</div>
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

      {/* Reviews Section */}
      <div className="w-full flex flex-col items-start gap-3">
        <div className="text-white text-[27px] font-inter leading-[27px]">Reviews</div>
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
    </div>
  );
};

export default MentorProfile;
