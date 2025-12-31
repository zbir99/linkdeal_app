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
    bank_name?: string;
    iban?: string;
    swift_bic?: string;
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

    // Banking Info State
    const [selectedMethod, setSelectedMethod] = useState<'bank' | 'paypal' | 'payoneer' | 'card'>('bank');
    const [bankingInfo, setBankingInfo] = useState({
        bank_name: '',
        iban: '',
        swift_bic: '',
        // Auxiliary fields for UI state
        email: '',
        card_number: '',
        card_name: ''
    });
    const [isSavingBanking, setIsSavingBanking] = useState(false);
    const [bankingSuccess, setBankingSuccess] = useState<string | null>(null);

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

            // Calculate funds
            let totalEarned = 0;
            let pendingFunds = 0;

            if (paymentsRes.data.data) {
                paymentsRes.data.data.forEach((p: PaymentHistory) => {
                    const amount = parseFloat(p.amount || '0');
                    // Funds are 'Pending' if payment is made but session not completed
                    if (p.status === 'completed' && p.session_status !== 'completed') {
                        pendingFunds += amount;
                    }
                    // Funds are 'Earned' if session is completed
                    else if (p.status === 'completed' && p.session_status === 'completed') {
                        totalEarned += amount;
                    }
                });
            }

            setWalletData({
                wallet_balance: parseFloat(profileRes.data.wallet_balance) || 0,
                total_earned: totalEarned,
                pending_payout: pendingFunds,
                bank_name: profileRes.data.bank_name,
                iban: profileRes.data.iban,
                swift_bic: profileRes.data.swift_bic
            });

            // Infer method from saved data
            const savedBankName = profileRes.data.bank_name || '';
            let method: 'bank' | 'paypal' | 'payoneer' | 'card' = 'bank';
            let email = '';
            let cardNumber = '';

            if (savedBankName === 'PayPal') {
                method = 'paypal';
                email = profileRes.data.iban || '';
            } else if (savedBankName === 'Payoneer') {
                method = 'payoneer';
                email = profileRes.data.iban || '';
            } else if (savedBankName === 'Bank Card') {
                method = 'card';
                cardNumber = profileRes.data.iban || '';
            }

            setSelectedMethod(method);
            setBankingInfo({
                bank_name: savedBankName,
                iban: profileRes.data.iban || '',
                swift_bic: profileRes.data.swift_bic || '',
                email: email,
                card_number: cardNumber,
                card_name: '' // Not stored in backend currently, so leave empty or could store in another field if needed
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

        if (!walletData.iban || !walletData.bank_name) {
            setWithdrawError('Please add your withdrawal method below first.');
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
        } catch (error: any) {
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

    const handleSaveBankingInfo = async () => {
        setIsSavingBanking(true);
        setBankingSuccess(null);

        // Prepare payload based on selected method
        let payload = {};

        if (selectedMethod === 'bank') {
            payload = {
                bank_name: bankingInfo.bank_name,
                iban: bankingInfo.iban,
                swift_bic: bankingInfo.swift_bic
            };
        } else if (selectedMethod === 'paypal') {
            payload = {
                bank_name: 'PayPal',
                iban: bankingInfo.email,
                swift_bic: ''
            };
        } else if (selectedMethod === 'payoneer') {
            payload = {
                bank_name: 'Payoneer',
                iban: bankingInfo.email,
                swift_bic: ''
            };
        } else if (selectedMethod === 'card') {
            payload = {
                bank_name: 'Bank Card',
                iban: bankingInfo.card_number,
                swift_bic: ''
            };
        }

        try {
            await api.patch('auth/mentors/profile/me/', payload);
            setBankingSuccess('Withdrawal method updated successfully');
            // Update local wallet data to reflect saved changes (for validation)
            setWalletData(prev => ({ ...prev, ...payload }));
        } catch (error) {
            console.error('Failed to save banking info:', error);
        } finally {
            setIsSavingBanking(false);
        }
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
            <div className="max-w-7xl mx-auto space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Available Balance Card */}
                    <div className="bg-gradient-to-br from-[#7008E7]/30 to-[#5a07b8]/20 rounded-2xl border border-white/10 p-6 backdrop-blur-md">
                        <div className="flex flex-col gap-6">
                            <div className="space-y-1">
                                <p className="text-white/60 text-sm">Available for Withdrawal</p>
                                <p className="text-4xl md:text-5xl font-bold text-white">
                                    ${walletData.wallet_balance.toFixed(2)}
                                </p>
                                <p className="text-white/40 text-xs">Total lifetime earnings: ${walletData.total_earned.toFixed(2)}</p>
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

                    {/* Pending Funds Card */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-md flex flex-col justify-between">
                        <div className="space-y-1">
                            <p className="text-yellow-400/80 text-sm font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                Pending (Held in Escrow)
                            </p>
                            <p className="text-4xl md:text-5xl font-bold text-white/90">
                                ${walletData.pending_payout.toFixed(2)}
                            </p>
                            <p className="text-white/40 text-xs">Funds from upcoming sessions. Released upon completion.</p>
                        </div>
                        <div className="mt-4 p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-xs text-yellow-200/80 leading-relaxed">
                                    These funds are securely held by the platform. They will be automatically moved to your "Available for Withdrawal" balance immediately after each session is successfully completed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Transaction History</h3>
                    <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                        {[
                            ...payments.map(p => ({ ...p, type: 'earning' })),
                            ...payouts.map(p => ({ ...p, type: 'withdrawal' }))
                        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .length === 0 ? (
                            <div className="p-12 text-center text-white/40">
                                No transactions found
                            </div>
                        ) : (
                            [
                                ...payments.map(p => ({ ...p, type: 'payment' })),
                                ...payouts.map(p => ({ ...p, type: 'payout' }))
                            ]
                                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                .map((tx: any) => {
                                    const isPayout = tx.type === 'payout';
                                    const isPendingEarning = !isPayout && tx.status === 'completed' && tx.session_status !== 'completed';

                                    let iconColorClass = '';
                                    let amountColorClass = '';
                                    let StatusIcon = null;

                                    if (isPayout) {
                                        // Withdrawal - Red
                                        iconColorClass = 'bg-red-500/20 text-red-500';
                                        amountColorClass = 'text-red-400';
                                        StatusIcon = (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 19V5M5 12L12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        );
                                    } else if (isPendingEarning) {
                                        // Pending Earning - Yellow
                                        iconColorClass = 'bg-yellow-500/20 text-yellow-500';
                                        amountColorClass = 'text-yellow-400';
                                        StatusIcon = (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        );
                                    } else {
                                        // Completed Earning (or other states) - Green
                                        iconColorClass = 'bg-green-500/20 text-green-500';
                                        amountColorClass = 'text-green-400';
                                        StatusIcon = (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 5V19M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        );
                                    }

                                    return (
                                        <div key={`${tx.type}-${tx.id}`} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColorClass}`}>
                                                    {StatusIcon}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {isPayout ? 'Withdrawal' : (tx.mentee_name || 'Session Earning')}
                                                    </p>
                                                    <p className="text-white/40 text-sm">
                                                        {new Date(tx.created_at).toLocaleDateString()} at {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold ${amountColorClass}`}>
                                                    {isPayout ? '-' : '+'}${parseFloat(tx.amount).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-white/40">
                                                    {isPayout
                                                        ? (tx.status === 'processed' ? 'Processed' : 'Processing')
                                                        : (isPendingEarning ? 'Pending Session' : 'Completed')}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </div>

                {/* Withdrawal Methods Section */}
                <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                Withdrawal Methods
                            </h3>
                            <p className="text-white/60 text-sm">Securely add your payment details to receive payouts.</p>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto">

                        {/* Method Tabs */}
                        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 justify-center">
                            {[
                                {
                                    id: 'bank',
                                    name: 'Bank Transfer',
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M5 21V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M19 21V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M5 7L12 3L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10 9H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )
                                },
                                {
                                    id: 'paypal',
                                    name: 'PayPal',
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.05078 20.2547L8.09375 13.5625H10.1562C13.25 13.5625 15.6562 11.875 15.6562 8.78125C15.6562 6.53125 14.2266 5 11.5547 5H6.20703L3.5625 22H6.76953L7.05078 20.2547Z" fill="currentColor" fillOpacity="0.4" />
                                            <path d="M17.0625 8.78125C17.0625 12.7188 13.9219 14.8281 10.1562 14.8281H8.30469L7.32031 21.0156L7.15625 22H11.5547L12.5977 15.3047H13.6289C16.7227 15.3047 19.1289 13.6172 19.1289 10.5234C19.1289 9.90234 19.0352 9.31641 18.8711 8.78125H17.0625Z" fill="currentColor" />
                                        </svg>
                                    )
                                },
                                {
                                    id: 'payoneer',
                                    name: 'Payoneer',
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor" fillOpacity="0.4" />
                                            <path d="M12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7Z" fill="currentColor" />
                                        </svg>
                                    )
                                },
                                {
                                    id: 'card',
                                    name: 'Bank Card',
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2 10H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )
                                }
                            ].map(method => (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id as any)}
                                    className={`
                                        flex items-center gap-3 px-6 py-4 rounded-xl border transition-all whitespace-nowrap
                                        ${selectedMethod === method.id
                                            ? 'bg-[#7008E7] border-[#7008E7] text-white shadow-lg shadow-[#7008E7]/20 scale-[1.02]'
                                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}
                                    `}
                                >
                                    {method.icon}
                                    <span className="font-medium">{method.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-6">

                            {selectedMethod === 'bank' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-white/60 mb-1">Bank Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={bankingInfo.bank_name}
                                                onChange={(e) => setBankingInfo({ ...bankingInfo, bank_name: e.target.value })}
                                                placeholder="e.g. JPMorgan Chase, Wise, Revolut"
                                                className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#7008E7] transition-all"
                                            />
                                            <div className="absolute left-4 top-3.5 text-white/40">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M5 21V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M19 21V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M5 7L12 3L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M10 9H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">IBAN / Account Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={bankingInfo.iban}
                                                onChange={(e) => setBankingInfo({ ...bankingInfo, iban: e.target.value })}
                                                placeholder="Enter IBAN or Account Number"
                                                className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#7008E7] transition-all font-mono text-sm"
                                            />
                                            <div className="absolute left-4 top-3.5 text-white/40">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 13H14C14 13 16 13 16 16C16 19 14 19 14 19H10V13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M10 13V7H14C14 7 16 7 16 10C16 13 14 13 14 13H10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">SWIFT / BIC Code</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={bankingInfo.swift_bic}
                                                onChange={(e) => setBankingInfo({ ...bankingInfo, swift_bic: e.target.value })}
                                                placeholder="Enter SWIFT / BIC Code"
                                                className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#7008E7] transition-all font-mono text-sm"
                                            />
                                            <div className="absolute left-4 top-3.5 text-white/40">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                    <path d="M2 12H22" stroke="currentColor" strokeWidth="2" />
                                                    <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(selectedMethod === 'paypal' || selectedMethod === 'payoneer') && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <label className="block text-sm text-white/60 mb-1">
                                        {selectedMethod === 'paypal' ? 'PayPal Email Address' : 'Payoneer Email Address'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={bankingInfo.email}
                                            onChange={(e) => setBankingInfo({ ...bankingInfo, email: e.target.value })}
                                            placeholder={`Enter coming with your ${selectedMethod === 'paypal' ? 'PayPal' : 'Payoneer'} account`}
                                            className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#7008E7] transition-all"
                                        />
                                        <div className="absolute left-4 top-3.5 text-white/40">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedMethod === 'card' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Card Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={bankingInfo.card_number}
                                                onChange={(e) => {
                                                    // Basic formatting for card number visual
                                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                                    setBankingInfo({ ...bankingInfo, card_number: val });
                                                }}
                                                placeholder="0000 0000 0000 0000"
                                                className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#7008E7] transition-all font-mono text-sm"
                                                maxLength={19}
                                            />
                                            <div className="absolute left-4 top-3.5 text-white/40">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M2 10H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-white/5">
                            {bankingSuccess && (
                                <p className="text-green-400 text-sm flex items-center gap-1.5 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Withdrawal method saved securely
                                </p>
                            )}
                            <button
                                onClick={handleSaveBankingInfo}
                                disabled={isSavingBanking}
                                className="px-8 py-3 rounded-xl bg-[#7008E7] hover:bg-[#5a07b8] text-white font-medium transition-all shadow-lg shadow-[#7008E7]/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                            >
                                {isSavingBanking ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 16V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Save Details
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
