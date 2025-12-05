import { FunctionComponent } from 'react';
import { VDCallContainer } from '../components/vd_call';

const Vd_call: FunctionComponent = () => {
  return (
    <div className="h-screen bg-[linear-gradient(180deg,#0a0a1a,#1a1a2e_50%,#2a1a3e)] overflow-hidden">
      <VDCallContainer />
    </div>
  );
};

export default Vd_call;