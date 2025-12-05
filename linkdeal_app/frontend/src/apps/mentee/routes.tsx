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

// Mentee App Routes
export const menteeRoutes: RouteObject[] = [
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
    {
        path: '/mentee/dashboard',
        element: <Dashboard />
    },
    {
        path: '/mentee/profile',
        element: <Profile />
    },
    {
        path: '/mentee/profile-modif',
        element: <ProfileModifMentee />
    },
    {
        path: '/mentee/notifications',
        element: <Notifications />
    },
    {
        path: '/mentee/ai-chat',
        element: <AiChat />
    },
    {
        path: '/mentee/find-mentor',
        element: <FindMentor />
    },
    {
        path: '/mentee/description',
        element: <Description />
    },
    {
        path: '/mentee/booking',
        element: <Booking />
    },
    {
        path: '/mentee/rate',
        element: <Rate />
    },
    {
        path: '/mentee/tickets',
        element: <My_tickets />
    },
    {
        path: '/mentee/contact-us',
        element: <Tickets />
    },
    {
        path: '/mentee/payment-history',
        element: <Payment_history />
    },
    {
        path: '/mentee/signup',
        element: <Signup />
    },
    {
        path: '/mentee/video-call',
        element: <Vd_call />
    },
    {
        path: '/mentee/session-history',
        element: <SessionHistory />
    }
];
