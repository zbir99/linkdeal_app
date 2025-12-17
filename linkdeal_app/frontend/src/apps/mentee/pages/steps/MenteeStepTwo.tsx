import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMenteeSignup } from "@/apps/mentee/context/MenteeSignupContext";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { UnsavedChangesModal } from "@/components/UnsavedChangesModal";

const interestOptions = [
    'Web Development',
    'Mobile Apps',
    'AI/ML',
    'Data Science',
    'UI/UX Design',
    'Marketing',
    'Business',
    'Finance',
    'E-commerce',
    'SaaS',
    'EdTech',
    'HealthTech',
    'Blockchain',
    'Gaming',
    'IoT',
    'Cybersecurity',
    'AR/VR',
    'Robotics'
];

export const Infor = (): JSX.Element => {
    const navigate = useNavigate();
    const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
    const { signupData, updateSignupData } = useMenteeSignup();

    // Determine if the form has unsaved changes
    const hasUnsavedChanges = useMemo(() => {
        return selectedInterests.length > 0;
    }, [selectedInterests]);

    // Navigation guard - warns user about losing changes
    const {
        showModal,
        handleStayOnPage,
        handleLeaveAnyway,
    } = useNavigationGuard({
        when: hasUnsavedChanges,
        message: 'You have unsaved registration data. Are you sure you want to leave?',
        allowedPaths: ['/mentee/step1', '/mentee/step3', '/signup'],  // Allow navigation within signup flow
    });

    // Pre-fill interests from context when navigating back
    useEffect(() => {
        if (signupData.interests && signupData.interests.length > 0) {
            // Convert interest names back to indices
            const indices = signupData.interests
                .map(interest => interestOptions.indexOf(interest))
                .filter(index => index !== -1);
            setSelectedInterests(indices);
        }
    }, []);

    // NOTE: beforeunload handler was removed - see MenteeStepOne for details

    const handlePreviousClick = () => {
        navigate('/mentee/step1');
    };

    const handleNextClick = () => {
        // Convert selected interest indices to interest names
        const selectedInterestNames = selectedInterests.map(index => interestOptions[index]);
        // Save to context before navigating
        updateSignupData({ interests: selectedInterestNames });
        navigate('/mentee/step3');
    };

    const toggleInterest = (id: number) => {
        if (selectedInterests.includes(id)) {
            setSelectedInterests(selectedInterests.filter(interestId => interestId !== id));
        } else {
            setSelectedInterests([...selectedInterests, id]);
        }
    };
    return (
        <>
            {/* Unsaved Changes Warning Modal */}
            <UnsavedChangesModal
                isOpen={showModal}
                onStay={handleStayOnPage}
                onLeave={handleLeaveAnyway}
                title="Leave Registration?"
                message="You have unsaved registration data. Your progress will be lost if you leave this page."
            />

            <div className="w-full min-h-screen bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)]">
                <div className="hidden md:flex w-full min-h-screen items-center justify-center">
                    <div className="flex w-[672px] h-[713.6px] relative flex-col items-start">
                        <div className="relative self-stretch w-full h-[713.6px]">
                            <div className="flex flex-col w-[672px] h-[41px] items-start gap-3 absolute top-0 left-0">
                                <div className="flex h-[21px] items-center justify-between pr-[7.63e-06px] pl-0 py-0 relative self-stretch w-full">
                                    <div className="relative w-[67.74px] h-[21px]">
                                        <div className="absolute top-px left-0 w-[68px] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-[21px]">
                                            Step 2 of 3
                                        </div>
                                    </div>

                                    <div className="relative w-[91.84px] h-[21px]">
                                        <div className="absolute top-px left-0 w-[92px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm tracking-[0] leading-[21px]">
                                            67% Complete
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col h-2 items-start pl-0 pr-[224.01px] py-0 bg-[#364153] rounded-[26843500px] overflow-hidden relative self-stretch w-full">
                                    <div className="h-2 bg-[#7008e7] relative self-stretch w-full" />
                                </div>
                            </div>

                            <div className="flex flex-col w-[672px] h-[592px] items-start gap-12 pl-8 pr-8 pt-8 pb-0 absolute top-[73px] left-0 bg-[#ffffff0d] rounded-2xl border-[0.8px] border-solid border-[#fffefe1a]">
                                <div className="flex-col h-[71px] gap-2 flex w-[606.4px] items-start relative">
                                    <div className="relative self-stretch w-full h-[42px]">
                                        <div className="absolute top-0 left-0 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[42px] whitespace-nowrap">
                                            What brings you here?
                                        </div>
                                    </div>

                                    <div className="relative self-stretch w-full h-[21px]">
                                        <p className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                            Select your interests and goals
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-col h-[306.35px] gap-3 flex w-[606.4px] items-start relative">
                                    <div className="flex h-[21px] items-center gap-2 relative self-stretch w-full">
                                        <div className="relative w-fit mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                            Select your interests
                                        </div>
                                    </div>

                                    <div className="h-[238.35px] relative self-stretch w-full">
                                        <div className={`flex w-[119px] h-[34px] items-center justify-center gap-1 p-2 absolute top-0 left-0 rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(0)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(0)}>
                                            <div className={`relative w-fit mt-[-0.01px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(0) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                Web Development
                                            </div>
                                        </div>

                                        <div className={`w-[87px] top-0 left-[205px] flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(1)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(1)}>
                                            <div className={`relative w-fit mt-[-0.01px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(1) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                Mobile Apps
                                            </div>
                                        </div>

                                        <div className={`w-[51px] top-0 left-[410px] flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(2)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(2)}>
                                            <div className={`relative w-fit mt-[-0.01px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(2) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                AI/ML
                                            </div>
                                        </div>

                                        <div className={`w-[87px] top-[42px] left-0 flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(3)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(3)}>
                                            <div className={`relative w-fit mt-[-0.01px] ml-[-0.46px] mr-[-0.46px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(3) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                Data Science
                                            </div>
                                        </div>

                                        <div className={`w-[91px] top-[42px] left-[205px] flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(4)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(4)}>
                                            <div className={`relative w-fit mt-[-0.01px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(4) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                UI/UX Design
                                            </div>
                                        </div>

                                        <div className={`w-[74px] top-[42px] left-[410px] flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(5)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(5)}>
                                            <div className={`relative w-fit mt-[-0.01px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(5) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                Marketing
                                            </div>
                                        </div>

                                        <div className={`w-16 top-[83px] left-0 flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(6)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(6)}>
                                            <div className={`relative w-fit mt-[-0.01px] ml-[-0.56px] mr-[-0.56px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(6) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                Business
                                            </div>
                                        </div>

                                        <div className={`w-[59px] top-[83px] left-[205px] flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(7)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(7)}>
                                            <div className={`relative w-fit mt-[-0.01px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(7) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                Finance
                                            </div>
                                        </div>

                                        <div className={`w-[85px] top-[83px] left-[410px] flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(8)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(8)}>
                                            <div className={`relative w-fit mt-[-0.01px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(8) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                E-commerce
                                            </div>
                                        </div>

                                        <div className={`w-[43px] top-[125px] left-0 flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(9)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(9)}>
                                            <div className={`relative w-fit mt-[-0.01px] ml-[-1.40px] mr-[-1.40px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(9) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                SaaS
                                            </div>
                                        </div>

                                        <div className={`w-14 top-[125px] left-[205px] flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(10)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(10)}>
                                            <div className={`relative w-fit mt-[-0.01px] ml-[-0.75px] mr-[-0.75px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(10) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                EdTech
                                            </div>
                                        </div>

                                        <div className={`w-[78px] top-[125px] left-[410px] flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(11)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(11)}>
                                            <div className={`relative w-fit mt-[-0.01px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(11) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                HealthTech
                                            </div>
                                        </div>

                                        <div className={`w-[87px] top-[166px] left-0 flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(12)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(12)}>
                                            <div className={`relative w-fit mt-[-0.01px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(12) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                Blockchain
                                            </div>
                                        </div>

                                        <div className={`w-[65px] top-[166px] left-[205px] flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(13)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(13)}>
                                            <div className={`relative w-fit mt-[-0.01px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(13) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                Gaming
                                            </div>
                                        </div>

                                        <div className={`w-[61px] top-[166px] left-[410px] flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(14)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(14)}>
                                            <div className={`relative w-fit mt-[-0.01px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(14) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                IoT
                                            </div>
                                        </div>

                                        <div className={`w-[95px] top-[207px] left-0 flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(15)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(15)}>
                                            <div className={`relative w-fit mt-[-0.01px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(15) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                Cybersecurity
                                            </div>
                                        </div>

                                        <div className={`w-[52px] top-[207px] left-[205px] flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(16)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(16)}>
                                            <div className={`relative w-fit mt-[-0.01px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(16) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                AR/VR
                                            </div>
                                        </div>

                                        <div className={`w-[86px] top-[207px] left-[410px] flex h-[34px] items-center justify-center gap-1 p-2 absolute rounded-md overflow-hidden border-[0.8px] border-solid transition-all duration-300 ease-out cursor-pointer ${selectedInterests.includes(17)
                                            ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105'
                                            : 'bg-[#ffffff0d] border-[#354152] hover:bg-[#7008e733] hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02]'
                                            }`} onClick={() => toggleInterest(17)}>
                                            <div className={`relative w-fit mt-[-0.01px] [font-family:'Arimo-Regular',Helvetica] font-normal text-xs tracking-[0] leading-4 whitespace-nowrap transition-colors duration-200 ${selectedInterests.includes(17) ? 'text-[#A684FF]' : 'text-[#99a1ae] hover:text-white'
                                                }`}>
                                                Robotics
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative self-stretch w-full h-[18px] mt-4">
                                        <div className="absolute top-0 left-0 w-[109px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#697282] text-xs tracking-[0] leading-[18px]">
                                            Selected: {selectedInterests.length} interest{selectedInterests.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6 pb-0 border-t border-[#354152] w-full">
                                    <button className="flex items-center justify-center gap-2 px-6 py-2 bg-white text-[#2a1a3e] rounded-lg border border-[#354152] hover:bg-gray-50 hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out" onClick={handlePreviousClick}>
                                        <span className="text-sm font-medium">Previous</span>
                                    </button>

                                    <button className="flex items-center justify-center gap-2 px-6 py-2 bg-[#7008e7] text-white rounded-lg hover:bg-[#5f07d4] hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out relative overflow-hidden mr-6" onClick={handleNextClick}>
                                        <span className="text-sm font-medium relative z-10">Next Step</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            className="flex items-center justify-center w-full py-3 text-[#99a1ae] hover:text-white hover:scale-[1.05] transition-all duration-200 ease-in-out group"
                            onClick={() => navigate('/mentee/step3')}
                        >
                            <span className="text-sm font-medium">Skip for now</span>
                            <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile layout */}
                <div className="md:hidden px-5 py-10 text-white space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-white/80">Step 2 of 3</span>
                            <span className="text-white/60">67% Complete</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#7008e7] w-2/3" />
                        </div>
                    </div>

                    <div className="bg-[#ffffff0d] border border-white/10 rounded-2xl p-5 space-y-4">
                        <div>
                            <h2 className="text-2xl font-semibold">What brings you here?</h2>
                            <p className="text-white/60 text-sm mt-1">Select your interests and goals</p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-white/70">Select your interests</p>
                            <div className="flex flex-wrap gap-2">
                                {interestOptions.map((label, index) => {
                                    const selected = selectedInterests.includes(index);
                                    return (
                                        <button
                                            key={`mobile-interest-${label}`}
                                            className={`px-3 py-2 rounded-lg text-xs border ${selected
                                                ? 'bg-[#7008e733] border-[#8d51ff] text-[#A684FF]'
                                                : 'bg-white/5 border-white/15 text-white/70'
                                                }`}
                                            onClick={() => toggleInterest(index)}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-white/60">
                                Selected: {selectedInterests.length} interest{selectedInterests.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                className="flex-1 py-3 bg-white text-[#2a1a3e] rounded-xl border border-white/20 text-sm font-medium"
                                onClick={handlePreviousClick}
                            >
                                Previous
                            </button>
                            <button
                                className="flex-1 py-3 bg-[#7008e7] text-white rounded-xl text-sm font-medium"
                                onClick={handleNextClick}
                            >
                                Next Step
                            </button>
                        </div>
                        <button
                            className="text-sm text-white/70 underline-offset-2 hover:underline"
                            onClick={() => navigate('/mentee/step3')}
                        >
                            Skip for now
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
