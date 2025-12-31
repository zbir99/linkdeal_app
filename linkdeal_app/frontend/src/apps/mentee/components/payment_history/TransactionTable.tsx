import { FunctionComponent } from 'react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  method: string;
  type: string;
  status: string;
}

interface TransactionTableProps {
  searchQuery: string;
  onClearSearch?: () => void;
  transactions: Transaction[];
}

const TransactionTable: FunctionComponent<TransactionTableProps> = ({ searchQuery, onClearSearch, transactions }) => {
  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = searchQuery === '' ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'border-[#00C950]/30 bg-[#00C950]/20 text-[#05DF72]';
      case 'Pending':
        return 'border-[#FF6900]/30 bg-[#FF6900]/20 text-[#FF8904]';
      default:
        return 'border-gray-500/30 bg-gray-500/10 text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Income':
        return 'border-[#00C950]/30 bg-[#00C950]/20 text-[#05DF72]';
      case 'Payout':
        return 'border-[#8E51FF]/30 bg-[#7008E7]/20 text-[#A684FF]';
      default:
        return 'border-gray-500/30 bg-gray-500/10 text-gray-300';
    }
  };

  return (
    <div className="rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/30">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5">
          <thead>
            <tr className="text-left text-sm text-gray-400">
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Method</th>
              <th className="px-6 py-3 font-medium">Reference</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-gray-200 font-arimo">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2.5" y="4" width="17" height="13" rx="1.5" stroke="#A684FF" strokeWidth="1.6" />
                      <path d="M2.5 7.5H19.5" stroke="#A684FF" strokeWidth="1.6" />
                      <path d="M6.5 2.5V5" stroke="#A684FF" strokeWidth="1.6" />
                      <path d="M15.5 2.5V5" stroke="#A684FF" strokeWidth="1.6" />
                    </svg>
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4">{transaction.description}</td>
                  <td className="px-6 py-4 text-gray-400">{transaction.method}</td>
                  <td className="px-6 py-4 text-gray-500">{transaction.id}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.3137 14.3137 16 11 16C7.68629 16 5 13.3137 5 10C5 6.68629 7.68629 4 11 4C14.3137 4 17 6.68629 17 10Z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold text-white">No transactions found</h3>
                      <p className="text-sm text-gray-400">
                        {searchQuery
                          ? `No transactions found matching "${searchQuery}"`
                          : 'No transactions available'
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        Try adjusting your search or filter criteria
                      </p>
                      {searchQuery && onClearSearch && (
                        <button
                          onClick={onClearSearch}
                          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-300 text-sm font-medium hover:bg-purple-500/30 hover:border-purple-400/50 transition-colors"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Clear Search
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { TransactionTable };
