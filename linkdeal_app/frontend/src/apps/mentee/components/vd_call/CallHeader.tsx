import { FunctionComponent } from 'react';

export const CallHeader: FunctionComponent = () => {
  return (
    <div className="w-full bg-white/5 border-b border-white/10 backdrop-blur-sm px-3 sm:px-4 md:px-6 py-3 md:py-4 shrink-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 md:gap-4">
        <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0 flex-1">
          <h1 className="text-sm sm:text-base md:text-lg font-semibold text-white truncate">
            Video Call - LinkDeal
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-arimo">
            lynvia
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallHeader as FunctionComponent;
