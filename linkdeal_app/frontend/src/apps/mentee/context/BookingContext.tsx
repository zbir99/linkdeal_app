import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
interface MentorInfo {
    id: string;
    full_name: string;
    professional_title: string;
    profile_picture_url: string | null;
    session_rate: number;
}

interface SessionType {
    id: string;
    name: string;
    description: string;
    default_duration: number;
}

interface TimeSlot {
    day_of_week: number;
    day_name: string;
    start_time: string;
    end_time: string;
    is_available?: boolean;
    booked_until?: string | null;
}

interface BookingData {
    // Mentor info
    mentor: MentorInfo | null;

    // Session type
    sessionType: SessionType | null;
    sessionTypes: SessionType[];

    // Availability
    availableSlots: TimeSlot[];

    // Selected booking details
    selectedDate: Date | null;
    selectedTime: string;
    sessionTopic: string;
    duration: number;

    // Payment info (mocked for now)
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;

    // Loading states
    isLoading: boolean;
    error: string | null;

    // Created session
    createdSessionId: string | null;
}

interface BookingContextType extends BookingData {
    // Setters
    setMentor: (mentor: MentorInfo) => void;
    setSessionType: (type: SessionType | null) => void;
    setSessionTypes: (types: SessionType[]) => void;
    setAvailableSlots: (slots: TimeSlot[]) => void;
    setSelectedDate: (date: Date | null) => void;
    setSelectedTime: (time: string) => void;
    setSessionTopic: (topic: string) => void;
    setDuration: (duration: number) => void;
    setCardName: (name: string) => void;
    setCardNumber: (number: string) => void;
    setExpiryDate: (date: string) => void;
    setCvv: (cvv: string) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setCreatedSessionId: (id: string | null) => void;

    // Computed values
    totalPrice: number;

    // Reset
    resetBooking: () => void;
}

const initialState: BookingData = {
    mentor: null,
    sessionType: null,
    sessionTypes: [],
    availableSlots: [],
    selectedDate: null,
    selectedTime: '',
    sessionTopic: '',
    duration: 60,
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    isLoading: false,
    error: null,
    createdSessionId: null,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<BookingData>(initialState);

    const setMentor = (mentor: MentorInfo) => setState(prev => ({ ...prev, mentor }));
    const setSessionType = (sessionType: SessionType | null) => setState(prev => ({ ...prev, sessionType }));
    const setSessionTypes = (sessionTypes: SessionType[]) => setState(prev => ({ ...prev, sessionTypes }));
    const setAvailableSlots = (availableSlots: TimeSlot[]) => setState(prev => ({ ...prev, availableSlots }));
    const setSelectedDate = (selectedDate: Date | null) => setState(prev => ({ ...prev, selectedDate }));
    const setSelectedTime = (selectedTime: string) => setState(prev => ({ ...prev, selectedTime }));
    const setSessionTopic = (sessionTopic: string) => setState(prev => ({ ...prev, sessionTopic }));
    const setDuration = (duration: number) => setState(prev => ({ ...prev, duration }));
    const setCardName = (cardName: string) => setState(prev => ({ ...prev, cardName }));
    const setCardNumber = (cardNumber: string) => setState(prev => ({ ...prev, cardNumber }));
    const setExpiryDate = (expiryDate: string) => setState(prev => ({ ...prev, expiryDate }));
    const setCvv = (cvv: string) => setState(prev => ({ ...prev, cvv }));
    const setIsLoading = (isLoading: boolean) => setState(prev => ({ ...prev, isLoading }));
    const setError = (error: string | null) => setState(prev => ({ ...prev, error }));
    const setCreatedSessionId = (createdSessionId: string | null) => setState(prev => ({ ...prev, createdSessionId }));

    const totalPrice = state.mentor?.session_rate ?? 0;

    const resetBooking = () => setState(initialState);

    return (
        <BookingContext.Provider
            value={{
                ...state,
                setMentor,
                setSessionType,
                setSessionTypes,
                setAvailableSlots,
                setSelectedDate,
                setSelectedTime,
                setSessionTopic,
                setDuration,
                setCardName,
                setCardNumber,
                setExpiryDate,
                setCvv,
                setIsLoading,
                setError,
                setCreatedSessionId,
                totalPrice,
                resetBooking,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = (): BookingContextType => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};

export default BookingContext;
