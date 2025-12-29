import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactUs: FunctionComponent = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#0a0a1a,#1a1a2e_50%,#2a1a3e)] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-[140px] left-[50%] -translate-x-1/2 [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-purple-600/40 to-blue-900/40" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Back</span>
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        We're here to help! If you have any questions, issues, or feedback, don't hesitate to reach out.
                    </p>
                </div>

                {/* Contact Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="22,6 12,13 2,6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Get in Touch
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Email Support</h3>
                                <a
                                    href="mailto:contact.lynvia@gmail.com"
                                    className="text-purple-400 hover:text-purple-300 transition-colors text-lg font-semibold"
                                >
                                    contact.lynvia@gmail.com
                                </a>
                                <p className="text-white/50 text-sm mt-2">
                                    We typically respond within 24-48 hours
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help Topics */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#A684FF" strokeWidth="2" />
                            <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15848 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="17" r="1" fill="#A684FF" />
                        </svg>
                        How We Can Help
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <h3 className="text-white font-medium mb-2">🐛 Technical Issues</h3>
                            <p className="text-white/50 text-sm">
                                Encountering bugs, errors, or app problems? Let us know and we'll fix it.
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <h3 className="text-white font-medium mb-2">👥 Mentor/Mentee Issues</h3>
                            <p className="text-white/50 text-sm">
                                Problems with sessions, bookings, or communication? We're here to mediate.
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <h3 className="text-white font-medium mb-2">💳 Payment & Billing</h3>
                            <p className="text-white/50 text-sm">
                                Questions about payments, refunds, or invoices? We'll sort it out.
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <h3 className="text-white font-medium mb-2">💡 Feedback & Suggestions</h3>
                            <p className="text-white/50 text-sm">
                                Have ideas to improve LinkDeal? We'd love to hear from you!
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
                    <p className="text-white/80 mb-4">
                        Ready to reach out? Send us an email with details about your concern.
                    </p>
                    <a
                        href="mailto:contact.lynvia@gmail.com?subject=LinkDeal Support Request"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Send Email
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
