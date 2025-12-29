import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

interface PaymentHistory {
    id: string;
    mentee_name: string;
    amount: string;
    currency: string;
    status: string;
    session_status: string;
    time_ago: string;
    created_at: string;
}

interface WalletData {
    wallet_balance: number;
    total_earned: number;
    pending_payout: number;
}

interface PayoutData {
    id: string;
    amount: string;
    currency: string;
    status: string;
    time_ago?: string;
    created_at: string;
    processed_at: string | null;
    bank_name: string;
    iban: string;
}

const Wallet: FunctionComponent = () => {
    const navigate = useNavigate();
    const [walletData, setWalletData] = useState<WalletData>({ wallet_balance: 0, total_earned: 0, pending_payout: 0 });
    const [payments, setPayments] = useState<PaymentHistory[]>([]);
    const [payouts, setPayouts] = useState<PayoutData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [withdrawError, setWithdrawError] = useState<string | null>(null);
    const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            setIsLoading(true);

            // Fetch wallet balance from mentor profile
            const profileRes = await api.get('auth/mentors/profile/me/');

            // Fetch payment history (earnings)
            const paymentsRes = await api.get('billing/payments/list/?limit=50');

            // Fetch payout history
            const payoutsRes = await api.get('billing/payouts/');

            // Calculate total earned from payments
            const totalEarned = paymentsRes.data.data?.reduce((sum: number, p: PaymentHistory) => {
                // Only count payments for completed sessions
                if (p.session_status === 'completed') {
                    return sum + parseFloat(p.amount || '0');
                }
                return sum;
            }, 0) || 0;

            setWalletData({
                wallet_balance: parseFloat(profileRes.data.wallet_balance) || 0,
                total_earned: totalEarned,
                pending_payout: 0
            });

            setPayments(paymentsRes.data.data || []);
            setPayouts(payoutsRes.data || []);
        } catch (error) {
            console.error('Failed to fetch wallet data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWithdraw = async () => {
        const amount = parseFloat(withdrawAmount);

        if (isNaN(amount) || amount < 200) {
            setWithdrawError('Minimum withdrawal amount is $200');
            return;
        }

        if (amount > walletData.wallet_balance) {
            setWithdrawError('Insufficient balance');
            return;
        }

        setIsWithdrawing(true);
        setWithdrawError(null);
        setWithdrawSuccess(null);

        try {
            await api.post('billing/payouts/request/', { amount });
            setWithdrawSuccess(`Successfully requested withdrawal of $${amount.toFixed(2)}`);
            setWithdrawAmount('');
            // Refresh data
            await fetchWalletData();
        } catch (error: unknown) {
            let errorMessage = 'Failed to process withdrawal';
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { error?: string; message?: string } } };
                errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.message || errorMessage;
            }
            setWithdrawError(errorMessage);
        } finally {
            setIsWithdrawing(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-white/10 rounded w-48" />
                        <div className="h-48 bg-white/10 rounded-2xl" />
                        <div className="h-64 bg-white/10 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/mentor/dashboard')}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-white">My Wallet</h1>
                        <p className="text-white/60 text-sm">Manage your earnings and withdrawals</p>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="bg-gradient-to-br from-[#7008E7]/30 to-[#5a07b8]/20 rounded-2xl border border-white/10 p-6 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-1">
                            <p className="text-white/60 text-sm">Available Balance</p>
                            <p className="text-4xl md:text-5xl font-bold text-white">
                                ${walletData.wallet_balance.toFixed(2)}
                            </p>
                            <p className="text-white/40 text-xs">Total earned: ${walletData.total_earned.toFixed(2)}</p>
                        </div>

                        {/* Withdraw Section */}
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                {/* Custom Amount Input with Modern Buttons */}
                                <div className="relative flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const current = parseFloat(withdrawAmount) || 0;
                                            if (current >= 250) setWithdrawAmount(String(current - 50));
                                        }}
                                        className="absolute left-2 w-7 h-7 rounded-lg bg-white/10 hover:bg-[#7008E7]/50 flex items-center justify-center transition-all duration-200 group"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/60 group-hover:text-white transition-colors">
                                            <path d="M2.5 6H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={withdrawAmount}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9.]/g, '');
                                            setWithdrawAmount(val);
                                        }}
                                        placeholder="Amount"
                                        className="w-36 px-10 py-2 text-center rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#7008E7] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const current = parseFloat(withdrawAmount) || 0;
                                            const max = walletData.wallet_balance;
                                            if (current + 50 <= max) setWithdrawAmount(String(current + 50));
                                        }}
                                        className="absolute right-2 w-7 h-7 rounded-lg bg-white/10 hover:bg-[#7008E7]/50 flex items-center justify-center transition-all duration-200 group"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/60 group-hover:text-white transition-colors">
                                            <path d="M6 2.5V9.5M2.5 6H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>
                                <button
                                    onClick={handleWithdraw}
                                    disabled={isWithdrawing || walletData.wallet_balance < 200}
                                    className="px-6 py-2 rounded-xl bg-[#7008E7] text-white font-medium hover:bg-[#5a07b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isWithdrawing ? 'Processing...' : 'Withdraw'}
                                </button>
                            </div>
                            <p className="text-white/40 text-xs">Minimum withdrawal: $200</p>
                            {withdrawError && <p className="text-red-400 text-xs">{withdrawError}</p>}
                            {withdrawSuccess && <p className="text-green-400 text-xs">{withdrawSuccess}</p>}
                        </div>
                    </div>
                </div>

                {/* Transactions Grid - Earnings and Withdrawals side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Earnings Section */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <h3 className="text-lg font-medium text-green-400">Earnings ({payments.length})</h3>
                        </div>
                        {payments.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#05DF72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="text-white/60">No earnings yet</p>
                                <p className="text-white/40 text-sm">Your earnings from sessions will appear here</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
                                {payments.map((payment) => (
                                    <div key={payment.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 5V19M5 12L12 5L19 12" stroke="#05DF72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Session with {payment.mentee_name || 'Mentee'}</p>
                                                <p className="text-white/40 text-xs">{payment.time_ago || formatDate(payment.created_at)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-green-400 font-medium">+${parseFloat(payment.amount).toFixed(2)}</p>
                                            <p className={`text-xs ${payment.status === 'completed' ? 'text-green-400/60' : 'text-yellow-400/60'}`}>
                                                {payment.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Withdrawals Section */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <h3 className="text-lg font-medium text-red-400">Withdrawals ({payouts.length})</h3>
                        </div>
                        {payouts.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 19V5M5 12L12 19L19 12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="text-white/60">No withdrawals yet</p>
                                <p className="text-white/40 text-sm">Your withdrawal history will appear here</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
                                {payouts.map((payout) => (
                                    <div key={payout.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 19V5M5 12L12 19L19 12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Withdrawal to {payout.bank_name || 'Bank'}</p>
                                                <p className="text-white/40 text-xs">{payout.time_ago || formatDate(payout.created_at)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-red-400 font-medium">-${parseFloat(payout.amount).toFixed(2)}</p>
                                            <p className={`text-xs ${payout.status === 'processed' ? 'text-red-400/60' : 'text-yellow-400/60'}`}>
                                                {payout.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
