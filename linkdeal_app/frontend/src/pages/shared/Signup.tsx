import linkDealLogo from "@/assets/landing_page/images/logo (2).png";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const roleCopy = {
    mentee: {
        title: "Mentee",
        subtitle: "I am looking for a mentor",
    },
    mentor: {
        title: "Mentor",
        subtitle: "I want to share my expertise",
    },
};

export const Signup = () => {
    const [selectedRole, setSelectedRole] = useState<"mentor" | "mentee" | null>(null);
    const navigate = useNavigate();

    // On page load: Check for stale social auth sessions and clear them
    // This handles users who started social auth but abandoned it
    useEffect(() => {
        const SOCIAL_AUTH_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
        const socialAuthTimestamp = sessionStorage.getItem('social_auth_timestamp');
        const isSocialAuthPending = sessionStorage.getItem('social_auth_pending') === 'true';

        // Clear if: there's a timestamp but it's stale (older than 30 min)
        // OR if there's leftover data but no valid pending flag
        let shouldClear = false;

        if (socialAuthTimestamp) {
            const elapsed = Date.now() - parseInt(socialAuthTimestamp, 10);
            if (elapsed > SOCIAL_AUTH_TIMEOUT_MS) {
                console.log('Signup - Clearing stale social auth data (older than 30 minutes)');
                shouldClear = true;
            }
        }

        // Also check if there's a picture but no pending flag (leftover from previous session)
        const hasPicture = sessionStorage.getItem('social_auth_picture') !== null;
        if (hasPicture && !isSocialAuthPending) {
            console.log('Signup - Clearing orphaned social auth data (no pending flag)');
            shouldClear = true;
        }

        if (shouldClear) {
            sessionStorage.removeItem('social_auth_pending');
            sessionStorage.removeItem('social_auth_timestamp');
            sessionStorage.removeItem('social_auth_name');
            sessionStorage.removeItem('social_auth_given_name');
            sessionStorage.removeItem('social_auth_family_name');
            sessionStorage.removeItem('social_auth_nickname');
            sessionStorage.removeItem('social_auth_picture');
            sessionStorage.removeItem('social_auth_email');
            sessionStorage.removeItem('social_auth_country');
            sessionStorage.removeItem('social_auth_language');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, []);

    const handleRoleSelect = (role: "mentor" | "mentee") => {
        setSelectedRole(role);

        // Check if user is coming from social auth (already authenticated with Auth0)
        const isSocialAuth = sessionStorage.getItem('social_auth_pending') === 'true';

        // Give the selection animation a moment to play before navigation.
        setTimeout(() => {
            if (role === "mentor") {
                navigate("/mentor/profilestep");
            } else {
                if (isSocialAuth) {
                    // Social auth: skip the signup form and go to step1
                    navigate("/mentee/step1");
                } else {
                    // Normal signup: clear any stale social auth data and go to signup form
                    sessionStorage.removeItem('social_auth_pending');
                    sessionStorage.removeItem('social_auth_timestamp');
                    sessionStorage.removeItem('social_auth_name');
                    sessionStorage.removeItem('social_auth_given_name');
                    sessionStorage.removeItem('social_auth_family_name');
                    sessionStorage.removeItem('social_auth_nickname');
                    sessionStorage.removeItem('social_auth_picture');
                    sessionStorage.removeItem('social_auth_email');
                    sessionStorage.removeItem('social_auth_country');
                    sessionStorage.removeItem('social_auth_language');
                    // Also clear access token since this is a fresh signup
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate("/mentee/signup");
                }
            }
        }, 180);
    };

    const renderRoleCard = (role: "mentor" | "mentee") => {
        const isSelected = selectedRole === role;
        const isMentor = role === "mentor";

        return (
            <button
                key={role}
                type="button"
                onClick={() => handleRoleSelect(role)}
                className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border px-6 py-9 text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a683ff] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${isSelected
                    ? "bg-white/10 border-[#a683ff] shadow-[0_20px_60px_rgba(112,_8,_231,_0.35)] scale-[1.02]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#a683ff]/60"
                    }`}
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-300 ${isSelected ? "scale-110" : "group-hover:scale-110"
                        }`}
                >
                    {isMentor ? (
                        <>
                            <path d="M21.3326 28V25.3333C21.3326 23.9188 20.7707 22.5623 19.7705 21.5621C18.7703 20.5619 17.4138 20 15.9993 20H7.99935C6.58486 20 5.22831 20.5619 4.22811 21.5621C3.22792 22.5623 2.66602 23.9188 2.66602 25.3333V28" stroke="#D1C1FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21.332 4.16992C22.4757 4.46642 23.4886 5.13428 24.2116 6.06867C24.9347 7.00307 25.327 8.15111 25.327 9.33259C25.327 10.5141 24.9347 11.6621 24.2116 12.5965C23.4886 13.5309 22.4757 14.1988 21.332 14.4953" stroke="#D1C1FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M29.332 28.0005V25.3338C29.3312 24.1521 28.9378 23.0042 28.2139 22.0703C27.4899 21.1363 26.4762 20.4693 25.332 20.1738" stroke="#D1C1FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11.9993 14.6667C14.9448 14.6667 17.3326 12.2789 17.3326 9.33333C17.3326 6.38781 14.9448 4 11.9993 4C9.05383 4 6.66602 6.38781 6.66602 9.33333C6.66602 12.2789 9.05383 14.6667 11.9993 14.6667Z" stroke="#D1C1FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                    ) : (
                        <>
                            <path d="M15.9993 29.3326C23.3631 29.3326 29.3326 23.3631 29.3326 15.9993C29.3326 8.63555 23.3631 2.66602 15.9993 2.66602C8.63555 2.66602 2.66602 8.63555 2.66602 15.9993C2.66602 23.3631 8.63555 29.3326 15.9993 29.3326Z" stroke="#D1C1FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 17.332C18.2091 17.332 20 15.5412 20 13.332C20 11.1229 18.2091 9.33203 16 9.33203C13.7909 9.33203 12 11.1229 12 13.332C12 15.5412 13.7909 17.332 16 17.332Z" stroke="#D1C1FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.33203 27.5486V25.3326C9.33203 24.6254 9.61298 23.9471 10.1131 23.447C10.6132 22.9469 11.2915 22.666 11.9987 22.666H19.9987C20.7059 22.666 21.3842 22.9469 21.8843 23.447C22.3844 23.9471 22.6654 24.6254 22.6654 25.3326V27.5486" stroke="#D1C1FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                    )}
                </svg>
                <p className="font-arimo text-lg font-medium text-white">{roleCopy[role].title}</p>
                <p className="text-sm text-[#a0a0b8]">{roleCopy[role].subtitle}</p>
            </button>
        );
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#0a0a1a_0%,#1a1a2e_50%,#2a1a3e_100%)] px-4 py-8 text-white">
            <div className="pointer-events-none absolute inset-0 opacity-50">
                <div className="absolute -left-10 top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(120,53,218,0.55),rgba(10,10,26,0))] blur-3xl" />
                <div className="absolute bottom-0 right-5 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.3),rgba(10,10,26,0))] blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-[720px] rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-6 text-center shadow-[0_20px_60px_rgba(5,5,20,0.55)] backdrop-blur-2xl md:p-12">
                <div className="flex flex-col items-center gap-3">
                    <img
                        src={linkDealLogo}
                        alt="LinkDeal Logo"
                        className="h-24 w-auto drop-shadow-[0_0_30px_rgba(166,131,255,0.65)]"
                    />
                    <p className="font-poppins text-[32px] font-semibold leading-tight">LinkDeal</p>
                    <p className="font-inter text-2xl">Welcome to LinkDeal</p>
                    <p className="max-w-md text-sm text-[#a0a0b8]">Please select how you want to join our community</p>
                </div>

                <div className="mt-12 text-left">
                    <p className="text-sm text-[#cfd3e0]">I wish to register as</p>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {renderRoleCard("mentee")}
                        {renderRoleCard("mentor")}
                    </div>
                </div>

                <div className="mt-14 flex flex-wrap items-center justify-center gap-2 text-sm text-[#a0a0b8]">
                    <span>Do you already have an account?</span>
                    <Link
                        to="/login"
                        className="text-[#a683ff] hover:text-white transition-colors duration-200"
                        onClick={() => {
                            // Clear social auth data when going back to login
                            sessionStorage.removeItem('social_auth_pending');
                            sessionStorage.removeItem('social_auth_timestamp');
                            sessionStorage.removeItem('social_auth_name');
                            sessionStorage.removeItem('social_auth_given_name');
                            sessionStorage.removeItem('social_auth_family_name');
                            sessionStorage.removeItem('social_auth_nickname');
                            sessionStorage.removeItem('social_auth_picture');
                            sessionStorage.removeItem('social_auth_email');
                            sessionStorage.removeItem('social_auth_country');
                            sessionStorage.removeItem('social_auth_language');
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                        }}
                    >
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
