import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatisticCards } from "../components/dashboard/StatisticCards";
import { QuickActionCards } from "../components/dashboard/QuickActionCards";
import { DashboardCharts } from "../components/dashboard/DashboardCharts";
import { RecentActivity } from "../components/dashboard/RecentActivity";

const PageHeader: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-[32px] font-normal leading-[48px] text-white font-inter">Admin Dashboard</h1>
        <p className="font-arimo text-[16px] font-normal leading-[24px] text-[#99A1AF]">Platform overview and management</p>
      </div>
      
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-300 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export const AdminDashboard: FunctionComponent = () => (
    <div className="relative w-full min-h-screen overflow-hidden bg-[linear-gradient(180deg,_#0a0a1a,_#1a1a2e_50%,_#2a1a3e)] text-white">
        <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute top-24 left-32 h-64 w-64 rounded-full bg-violet-500/40 blur-3xl" />
            <div className="absolute bottom-32 right-10 h-72 w-72 rounded-full bg-sky-500/30 blur-[140px]" />
            <svg className="absolute top-[-100px] left-[-100px]" width="612" height="640" viewBox="0 0 612 640" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_f_191_485)">
                    <path d="M128 319.996C128 213.96 213.96 128 319.996 128C426.033 128 511.992 213.96 511.992 319.996C511.992 426.033 426.033 511.992 319.996 511.992C213.96 511.992 128 426.033 128 319.996Z" fill="url(#paint0_linear_191_485)"/>
                </g>
                <defs>
                    <filter id="filter0_f_191_485" x="0" y="0" width="639.992" height="639.992" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feGaussianBlur stdDeviation="64" result="effect1_foregroundBlur_191_485"/>
                    </filter>
                    <linearGradient id="paint0_linear_191_485" x1="128" y1="128" x2="511.992" y2="511.992" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#E9D4FF" stop-opacity="0.2"/>
                        <stop offset="1" stop-color="#BEDBFF" stop-opacity="0.2"/>
                    </linearGradient>
                </defs>
            </svg>
            <svg className="absolute bottom-[-100px] right-[-100px]" width="640" height="640" viewBox="0 0 640 640" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_f_191_484)">
                    <path d="M128 319.996C128 213.96 213.96 128 319.996 128C426.033 128 511.992 213.96 511.992 319.996C511.992 426.033 426.033 511.992 319.996 511.992C213.96 511.992 128 426.033 128 319.996Z" fill="url(#paint0_linear_191_484)"/>
                </g>
                <defs>
                    <filter id="filter0_f_191_484" x="0" y="0" width="639.992" height="639.992" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feGaussianBlur stdDeviation="64" result="effect1_foregroundBlur_191_484"/>
                    </filter>
                    <linearGradient id="paint0_linear_191_484" x1="128" y1="128" x2="511.992" y2="511.992" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#8033D0" stop-opacity="0.4"/>
                        <stop offset="1" stop-color="#0A203B" stop-opacity="0.4"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>

        <div className="relative z-10 mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 py-8 lg:px-6">
            <PageHeader />
            <StatisticCards />
            <QuickActionCards />
            <DashboardCharts />
            <RecentActivity />
        </div>
    </div>
);

export default AdminDashboard;