import { RouteObject } from 'react-router-dom';
import { MentorProfile } from './pages/steps/MentorProfile';
import { Succes } from './pages/steps/MentorSuccess';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Availability from './pages/Availability';
import My_Mentees from './pages/My_Mentees';
import History_mentee from './pages/History_mentee';
import All_sessions from './pages/All_sessions';
import Pricing from './pages/Pricing';
import Support_tickets from './pages/Support_tickets';
import { Vd } from './pages/Vd';
import Tickets from './pages/Tickets';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mentor App Routes
export const mentorRoutes: RouteObject[] = [
  // Public signup flow routes
  {
    path: '/mentor/profilestep',
    element: <MentorProfile />
  },
  {
    path: '/mentor/step2',
    element: <MentorProfile />
  },
  {
    path: '/mentor/step3',
    element: <MentorProfile />
  },
  {
    path: '/mentor/success',
    element: <Succes />
  },
  // Protected routes (authentication required)
  {
    path: '/mentor/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: '/mentor/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: '/mentor/notifications',
    element: <ProtectedRoute><Notifications /></ProtectedRoute>
  },
  {
    path: '/mentor/availability',
    element: <ProtectedRoute><Availability /></ProtectedRoute>
  },
  {
    path: '/mentor/my-mentees',
    element: <ProtectedRoute><My_Mentees /></ProtectedRoute>
  },
  {
    path: '/mentor/history-mentee',
    element: <ProtectedRoute><History_mentee /></ProtectedRoute>
  },
  {
    path: '/mentor/all-sessions',
    element: <ProtectedRoute><All_sessions /></ProtectedRoute>
  },
  {
    path: '/mentor/pricing',
    element: <ProtectedRoute><Pricing /></ProtectedRoute>
  },
  {
    path: '/mentor/support-tickets',
    element: <ProtectedRoute><Support_tickets /></ProtectedRoute>
  },
  {
    path: '/mentor/vd',
    element: <ProtectedRoute><Vd /></ProtectedRoute>
  },
  {
    path: '/mentor/tickets',
    element: <ProtectedRoute><Tickets /></ProtectedRoute>
  }
];
