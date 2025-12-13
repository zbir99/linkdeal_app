import { RouteObject } from 'react-router-dom';
import { Information } from './pages/steps/MenteeStepOne';
import { Infor } from './pages/steps/MenteeStepTwo';
import { MenteeStepThree } from './pages/steps/MenteeStepThree';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProfileModifMentee from './pages/ProfileModifMentee';
import Notifications from './pages/Notifications';
import AiChat from './pages/Ai_chat';
import FindMentor from './pages/Find_mentor';
import Description from './pages/Description';
import Booking from './pages/Booking';
import Rate from './pages/Rate';
import My_tickets from './pages/My_tickets';
import Tickets from './pages/Tickets';
import Payment_history from './pages/Payment_history';
import Signup from './pages/Signup';
import Vd_call from './pages/Vd_call';
import SessionHistory from './pages/Session_history';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mentee App Routes
export const menteeRoutes: RouteObject[] = [
    // Public signup flow routes (no authentication required)
    {
        path: '/mentee/signup',
        element: <Signup />
    },
    {
        path: '/mentee/step1',
        element: <Information />
    },
    {
        path: '/mentee/step2',
        element: <Infor />
    },
    {
        path: '/mentee/step3',
        element: <MenteeStepThree />
    },
    // Protected routes (authentication required)
    {
        path: '/mentee/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
    },
    {
        path: '/mentee/profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
    },
    {
        path: '/mentee/profile-modif',
        element: <ProtectedRoute><ProfileModifMentee /></ProtectedRoute>
    },
    {
        path: '/mentee/notifications',
        element: <ProtectedRoute><Notifications /></ProtectedRoute>
    },
    {
        path: '/mentee/ai-chat',
        element: <ProtectedRoute><AiChat /></ProtectedRoute>
    },
    {
        path: '/mentee/find-mentor',
        element: <ProtectedRoute><FindMentor /></ProtectedRoute>
    },
    {
        path: '/mentee/description',
        element: <ProtectedRoute><Description /></ProtectedRoute>
    },
    {
        path: '/mentee/booking',
        element: <ProtectedRoute><Booking /></ProtectedRoute>
    },
    {
        path: '/mentee/rate',
        element: <ProtectedRoute><Rate /></ProtectedRoute>
    },
    {
        path: '/mentee/tickets',
        element: <ProtectedRoute><My_tickets /></ProtectedRoute>
    },
    {
        path: '/mentee/contact-us',
        element: <ProtectedRoute><Tickets /></ProtectedRoute>
    },
    {
        path: '/mentee/payment-history',
        element: <ProtectedRoute><Payment_history /></ProtectedRoute>
    },
    {
        path: '/mentee/video-call',
        element: <ProtectedRoute><Vd_call /></ProtectedRoute>
    },
    {
        path: '/mentee/session-history',
        element: <ProtectedRoute><SessionHistory /></ProtectedRoute>
    }
];
