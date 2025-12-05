import { FunctionComponent } from 'react';
import { CallHeader, VideoArea } from './index';

export const VDCallContainer: FunctionComponent = () => {
  return (
    <div className="w-full h-screen flex flex-col text-white font-inter overflow-hidden">
      <CallHeader />
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <VideoArea />
      </div>
    </div>
  );
};

export default VDCallContainer as FunctionComponent;
