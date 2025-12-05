import { FunctionComponent, useState } from 'react';
import { BackButton, PageHeader, TotalPayouts, FiltersAndActions, TransactionTable } from '.';

const PaymentHistoryForm: FunctionComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-2 sm:px-4 text-white font-inter">
      <div className="absolute -top-10 -left-6 w-60 h-60 rounded-full bg-[#8033d0]/30 blur-[160px]" />
      <div className="absolute bottom-0 -right-6 w-72 h-72 rounded-full bg-[#0a203b]/40 blur-[160px]" />

      <div className="relative space-y-6 sm:space-y-8 pb-8">
        <BackButton />
        <PageHeader />
        <TotalPayouts />
        <FiltersAndActions 
          searchQuery={searchQuery}
          filterType={filterType}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterType}
        />
        <TransactionTable 
          searchQuery={searchQuery}
          filterType={filterType}
          onClearSearch={handleClearSearch}
        />
      </div>
    </div>
  );
};

export { PaymentHistoryForm };
