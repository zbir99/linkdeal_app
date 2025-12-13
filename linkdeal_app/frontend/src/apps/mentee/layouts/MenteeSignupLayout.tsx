import { Outlet } from 'react-router-dom';
import { MenteeSignupProvider } from '../context/MenteeSignupContext';

/**
 * Layout component that wraps all mentee signup flow pages.
 * This ensures the MenteeSignupContext persists across all signup steps.
 */
export const MenteeSignupLayout = () => {
    return (
        <MenteeSignupProvider>
            <Outlet />
        </MenteeSignupProvider>
    );
};

export default MenteeSignupLayout;
