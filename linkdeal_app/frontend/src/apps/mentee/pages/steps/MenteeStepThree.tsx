import { useState } from "react";
import { useNavigate } from "react-router-dom";

const frequencyOptions = [
    { id: 0, title: "Once a week", description: "Regular weekly sessions" },
    { id: 1, title: "Every two weeks", description: "Bi-weekly sessions" },
    { id: 2, title: "Once a month", description: "Monthly check-ins" },
    { id: 3, title: "Flexible", description: "Schedule as needed" }
];

export const MenteeStepThree = (): JSX.Element => {
    const [selectedFrequency, setSelectedFrequency] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const navigate = useNavigate();
    return (
        <div className="bg-[#0a0a1a] w-full min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)]"></div>
            <div className="relative z-10 hidden md:flex flex-col items-center justify-center w-full max-w-[800px] px-8 min-h-screen mx-auto">
                <div className="flex flex-col h-auto min-h-[569.2px] items-center gap-8 pt-[32.8px] pb-[32.8px] px-[32.8px] relative self-stretch w-full bg-[#ffffff0d] backdrop-blur-xl rounded-[18px] border-[0.8px] border-solid border-[#fffefe1a] shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a]">
                    <div className="flex h-10 items-center justify-center gap-2 py-0 relative self-stretch w-full">
                        <div className="flex h-10 items-center gap-2 py-0 relative flex-1 max-w-[200px]">
                            <div className="flex w-10 h-10 items-center justify-center pl-0 pr-[0.01px] py-0 relative bg-[#7008e7] rounded-[26843500px]">
                                <div className="relative w-[7.44px] h-6">
                                    <div className="absolute -top-px left-0 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                                        1
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex-1 grow h-1 bg-[#7008e7]" />
                        </div>

                        <div className="flex h-10 items-center gap-2 py-0 relative flex-1 max-w-[200px]">
                            <div className="flex w-10 h-10 items-center justify-center pl-0 pr-[0.01px] py-0 relative bg-[#7008e7] rounded-[26843500px]">
                                <div className="relative w-[9.69px] h-6">
                                    <div className="absolute -top-px left-0 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                                        2
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex-1 grow h-1 bg-[#7008e7]" />
                        </div>

                        <div className="flex w-10 h-10 items-center justify-center pl-0 pr-[0.01px] py-0 relative bg-[#7008e7] rounded-[26843500px]">
                            <div className="relative w-[10.19px] h-6">
                                <div className="absolute -top-px left-0 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                                    3
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-8 w-full">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-[279px] h-[42px] [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[42px] whitespace-nowrap text-center">
                                When are you available?
                            </div>
                            
                            <p className="w-[294px] h-6 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-base tracking-[0] leading-6 whitespace-nowrap text-center">
                                Choose your preferred session frequency
                            </p>
                        </div>

                        <div className="flex flex-col items-start gap-4 w-full max-w-[606px]">
                            <div className={`w-full h-[82.6px] flex flex-col gap-1 rounded-xl border-[0.8px] border-solid p-4 cursor-pointer transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 ${
                                selectedFrequency === 0
                                    ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                                    : 'bg-[#ffffff0d] border-[#fffefe1a] hover:bg-[#ffffff1a] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                            }`}
                            onClick={() => setSelectedFrequency(0)}>
                                <div className={`w-[98px] h-6 [font-family:'Inter-Regular',Helvetica] font-normal text-base tracking-[0] leading-6 whitespace-nowrap ${
                                    selectedFrequency === 0 ? 'text-[#A684FF]' : 'text-white'
                                }`}>
                                    Once a week
                                </div>
                                <div className="w-[155px] h-[21px] [font-family:'Arimo-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                    Regular weekly sessions
                                </div>
                            </div>

                            <div className={`w-full h-[82.6px] flex flex-col gap-1 rounded-xl border-[0.8px] border-solid p-4 cursor-pointer transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 ${
                                selectedFrequency === 1
                                    ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                                    : 'bg-[#ffffff0d] border-[#fffefe1a] hover:bg-[#ffffff1a] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                            }`}
                            onClick={() => setSelectedFrequency(1)}>
                                <div className={`w-[129px] h-6 [font-family:'Inter-Regular',Helvetica] font-normal text-base tracking-[0] leading-6 whitespace-nowrap ${
                                    selectedFrequency === 1 ? 'text-[#A684FF]' : 'text-white'
                                }`}>
                                    Every two weeks
                                </div>
                                <div className="w-[119px] h-[21px] [font-family:'Arimo-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                    Bi-weekly sessions
                                </div>
                            </div>

                            <div className={`w-full h-[82.6px] flex flex-col gap-1 rounded-xl border-[0.8px] border-solid p-4 cursor-pointer transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 ${
                                selectedFrequency === 2
                                    ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                                    : 'bg-[#ffffff0d] border-[#fffefe1a] hover:bg-[#ffffff1a] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                            }`}
                            onClick={() => setSelectedFrequency(2)}>
                                <div className={`w-[107px] h-6 [font-family:'Inter-Regular',Helvetica] font-normal text-base tracking-[0] leading-6 whitespace-nowrap ${
                                    selectedFrequency === 2 ? 'text-[#A684FF]' : 'text-white'
                                }`}>
                                    Once a month
                                </div>
                                <div className="w-[113px] h-[21px] [font-family:'Arimo-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                    Monthly check-ins
                                </div>
                            </div>

                            <div className={`w-full h-[82.6px] flex flex-col gap-1 rounded-xl border-[0.8px] border-solid p-4 cursor-pointer transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 ${
                                selectedFrequency === 3
                                    ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                                    : 'bg-[#ffffff0d] border-[#fffefe1a] hover:bg-[#ffffff1a] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                            }`}
                            onClick={() => setSelectedFrequency(3)}>
                                <div className={`w-[58px] h-6 [font-family:'Inter-Regular',Helvetica] font-normal text-base tracking-[0] leading-6 whitespace-nowrap ${
                                    selectedFrequency === 3 ? 'text-[#A684FF]' : 'text-white'
                                }`}>
                                    Flexible
                                </div>
                                <div className="w-32 h-[21px] [font-family:'Arimo-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                    Schedule as needed
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full h-12 items-start gap-4 mt-8 max-w-[606px]">
            <button 
                                className="box-border bg-[#0a0a1a] border-[0.8px] border-solid border-[#fffefe1a] flex h-12 items-center justify-center gap-2 px-4 py-2 flex-1 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:bg-[#ffffff1a] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105"
                                onClick={() => navigate('/mentee/step2')}
                            >
                                <div className="w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
                                    Back
                                </div>
                            </button>

                            <button 
                                className={`border-none outline-none flex h-12 items-center justify-center gap-2 px-4 py-2 flex-1 rounded-xl cursor-pointer transition-all duration-300 ease-out ${
                                    isPressed 
                                        ? 'bg-[#5005a3] scale-95 shadow-lg shadow-purple-500/20' 
                                        : isHovered 
                                            ? 'bg-[#6007c5] scale-105 shadow-xl shadow-purple-500/30' 
                                            : 'bg-[#7008e7] shadow-lg shadow-purple-500/25'
                                }`}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onMouseDown={() => setIsPressed(true)}
                                onMouseUp={() => setIsPressed(false)}
                                onClick={() => navigate('/mentee/dashboard')}
                            >
                                <div className={`w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm text-center tracking-[0] leading-5 whitespace-nowrap transition-transform duration-300 ${
                                    isHovered ? 'scale-105' : 'scale-100'
                                }`}>
                                    Get Started
                                </div>
                                <div className="w-4 h-4 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile layout */}
            <div className="relative z-10 md:hidden px-5 py-10 space-y-6 text-white">
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-white/80">Step 3 of 3</span>
                        <span className="text-white/60">100% Complete</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7008e7]" />
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold">When are you available?</h2>
                        <p className="text-white/60 text-sm">Choose your preferred session frequency</p>
                    </div>

                    <div className="space-y-3">
                        {frequencyOptions.map((option) => {
                            const selected = selectedFrequency === option.id;
                            return (
                                <button
                                    key={`mobile-frequency-${option.id}`}
                                    className={`w-full text-left px-4 py-3 rounded-xl border ${
                                        selected
                                            ? "bg-[#7008e733] border-[#8d51ff] text-[#A684FF]"
                                            : "bg-white/5 border-white/15 text-white/80"
                                    }`}
                                    onClick={() => setSelectedFrequency(option.id)}
                                >
                                    <div className="text-base font-medium">{option.title}</div>
                                    <p className="text-xs text-white/70 mt-1">{option.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            className="flex-1 py-3 bg-white text-[#2a1a3e] rounded-xl border border-white/20 text-sm font-medium"
                            onClick={() => navigate("/mentee/step2")}
                        >
                            Back
                        </button>
                        <button
                            className="flex-1 py-3 bg-[#7008e7] text-white rounded-xl text-sm font-medium"
                            onClick={() => {
                                console.log("Navigating to /mentee/dashboard");
                                window.location.href = "/mentee/dashboard";
                            }}
                        >
                            Get Started
                        </button>
                    </div>
                    <button
                        className="text-sm text-white/70 underline-offset-2 hover:underline"
                        onClick={() => navigate("/mentee/dashboard")}
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};
