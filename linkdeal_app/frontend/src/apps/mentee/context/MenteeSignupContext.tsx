import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of all signup data
export interface MenteeSignupData {
    // Step 0: Initial signup page
    full_name: string;
    email: string;
    password: string;
    field_of_study: string;
    country: string;

    // Step 1: Profile info
    profile_picture: File | null;
    profile_picture_preview: string;
    selected_role: string; // Student, Professional, etc.
    language: string;

    // Step 2: Interests
    interests: string[];

    // Step 3: Availability
    session_frequency: string;
}

const defaultSignupData: MenteeSignupData = {
    // Step 0
    full_name: '',
    email: '',
    password: '',
    field_of_study: '',
    country: '',

    // Step 1
    profile_picture: null,
    profile_picture_preview: '',
    selected_role: '',
    language: '',

    // Step 2
    interests: [],

    // Step 3
    session_frequency: '',
};

interface MenteeSignupContextType {
    signupData: MenteeSignupData;
    updateSignupData: (data: Partial<MenteeSignupData>) => void;
    resetSignupData: () => void;
    isComplete: () => boolean;
}

const MenteeSignupContext = createContext<MenteeSignupContextType | undefined>(undefined);

export const MenteeSignupProvider = ({ children }: { children: ReactNode }) => {
    const [signupData, setSignupData] = useState<MenteeSignupData>(defaultSignupData);

    const updateSignupData = (data: Partial<MenteeSignupData>) => {
        setSignupData(prev => ({
            ...prev,
            ...data
        }));
    };

    const resetSignupData = () => {
        setSignupData(defaultSignupData);
    };

    const isComplete = () => {
        return !!(
            signupData.full_name &&
            signupData.email &&
            signupData.password &&
            signupData.field_of_study &&
            signupData.country
        );
    };

    return (
        <MenteeSignupContext.Provider value={{
            signupData,
            updateSignupData,
            resetSignupData,
            isComplete
        }}>
            {children}
        </MenteeSignupContext.Provider>
    );
};

export const useMenteeSignup = (): MenteeSignupContextType => {
    const context = useContext(MenteeSignupContext);
    if (!context) {
        throw new Error('useMenteeSignup must be used within a MenteeSignupProvider');
    }
    return context;
};

export default MenteeSignupContext;
