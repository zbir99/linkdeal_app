import { FunctionComponent } from 'react';

const PageHeader: FunctionComponent = () => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl sm:text-[32px] font-semibold">Payment History</h1>
      <p className="text-base text-gray-300 font-arimo">
        Track all your transactions and earnings
      </p>
    </div>
  );
};

export { PageHeader };
