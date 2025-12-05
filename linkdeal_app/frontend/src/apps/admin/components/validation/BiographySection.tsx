import { FunctionComponent } from 'react';

const BiographySection: FunctionComponent = () => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Biography</h3>
      
      <p className="text-sm sm:text-base text-white/70 leading-relaxed">
        Passionate Full-Stack Developer with over 8 years of experience creating modern web applications. 
        Specialized in React, Node.js, and cloud architecture. I've mentored over 50 junior developers 
        in their skill development.
      </p>
    </div>
  );
};

export default BiographySection;
