import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FunctionComponent, useState, useEffect } from 'react';
import { BackButton, PageHeader, TotalPayouts, FiltersAndActions, TransactionTable } from '.';
import api from '../../../../services/api';

const PaymentHistoryForm: FunctionComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState('0.00');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/billing/payments/list/');
        if (response.data.success) {
          let total = 0;
          const mappedTransactions = response.data.data.map((p: any) => {
            total += parseFloat(p.amount || '0');
            return {
              id: p.id.split('-')[0].toUpperCase(), // Shorten ID for display
              date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              description: `Session with ${p.mentor_name}`,
              method: 'Bank Transfer', // Defaulting as specific method might not be in list view
              status: p.status === 'completed' ? 'Completed' : 'Pending',
              type: 'Payout', // Mentee payments are outgoing
              amount: `$${p.amount}`
            };
          });

          setTotalSpent(total.toFixed(2));
          setTransactions(mappedTransactions);
        }
      } catch (error) {
        console.error('Failed to fetch payment history:', error);
      }
    };

    fetchTransactions();
  }, []);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleExport = () => {
    const doc = new jsPDF();

    // Add Header
    doc.setFontSize(20);
    doc.text('Payment History Report', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Add Table
    autoTable(doc, {
      startY: 35,
      head: [['Date', 'Description', 'Method', 'Status', 'Amount']],
      body: transactions.map(t => [t.date, t.description, t.method, t.status, t.amount]),
      theme: 'grid',
      headStyles: { fillColor: [112, 8, 231] }, // #7008E7
    });

    doc.save('LinkDeal_Payment_Report.pdf');
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 text-white font-inter">
      <div className="absolute -top-10 -left-6 w-60 h-60 rounded-full bg-[#8033d0]/30 blur-[160px]" />
      <div className="absolute bottom-0 -right-6 w-72 h-72 rounded-full bg-[#0a203b]/40 blur-[160px]" />

      <div className="relative space-y-6 sm:space-y-8 pb-8">
        <BackButton />
        <PageHeader />
        <TotalPayouts totalAmount={totalSpent} />
        <FiltersAndActions
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onExport={handleExport}
        />
        <TransactionTable
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
          transactions={transactions}
        />
      </div>
    </div>
  );
};

export { PaymentHistoryForm };
