export const Succes = (): JSX.Element => {
    return (
        <div className="bg-[#0a0a1a] w-full min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)]"></div>
            
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[383.99px] h-[383.99px] rounded-[32014000px] blur-3xl bg-[linear-gradient(117deg,rgba(233,212,255,0.2)_0%,rgba(190,219,255,0.2)_100%)]" />
                <div className="absolute top-[40%] right-[10%] w-[383.99px] h-[383.99px] rounded-[32014000px] blur-3xl bg-[linear-gradient(117deg,rgba(128,51,208,0.4)_0%,rgba(10,32,59,0.4)_100%)]" />
                <div className="absolute bottom-[20%] left-[30%] w-[383.99px] h-[383.99px] rounded-[32014000px] blur-3xl bg-[linear-gradient(117deg,rgba(128,51,208,0.4)_0%,rgba(10,32,59,0.4)_100%)]" />
            </div>

            {/* Desktop content */}
            <div className="relative z-10 hidden md:flex items-center justify-center w-full min-h-screen">
                <div className="w-[600px] h-[400px] bg-[#ffffff0d] backdrop-blur-xl rounded-2xl border-[0.8px] border-solid border-[#fffefe1a] shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a] flex flex-col items-center justify-center gap-8 -mt-4">
                    <div className="flex w-20 h-20 items-center justify-center bg-[#00c95033] rounded-[26843500px]">
                        <div className="relative w-10 h-10">
                            <svg className="absolute w-full h-full" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M26.6663 8L11.9997 22.6667L5.33301 16" stroke="#00C950" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-white text-[32px] text-center tracking-[0] leading-[42px] whitespace-nowrap">
                            Request sent
                        </div>
                        <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-lg text-center tracking-[0] leading-[21px]">
                            Please wait for confirmation
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile content */}
            <div className="relative z-10 md:hidden min-h-screen flex items-center justify-center px-6 py-16 text-white">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4 w-full max-w-sm">
                    <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-[#00c95033]">
                        <svg className="w-8 h-8 text-[#00C950]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold">Request sent</h2>
                    <p className="text-white/70 text-sm">Please wait for confirmation</p>
                </div>
            </div>
        </div>
    );
};
