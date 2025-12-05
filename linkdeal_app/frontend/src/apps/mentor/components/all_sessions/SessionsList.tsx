import { FunctionComponent } from 'react';
import { SessionCard } from './SessionCard';

export interface Session {
  id: string;
  title: string;
  menteeName: string;
  menteeInitials: string;
  date: string;
  time: string;
  duration: string;
  rating: number;
  price: number;
  status: 'completed' | 'upcoming' | 'cancelled';
  topic: string;
  feedback: string;
}

export const SessionsList: FunctionComponent = () => {
  const sessions: Session[] = [
    {
      id: '1',
      title: 'React Fundamentals',
      menteeName: 'John Doe',
      menteeInitials: 'JD',
      date: 'Thursday, November 28, 2024',
      time: '09:00 - 10:00',
      duration: '1h',
      rating: 5.0,
      price: 50,
      status: 'completed',
      topic: 'Introduction to React components, props, and state management. Covered basic hooks like useState and useEffect.',
      feedback: 'John showed great understanding of the concepts. Recommended practice with building a todo app.'
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      menteeName: 'Sarah Smith',
      menteeInitials: 'SS',
      date: 'Wednesday, November 27, 2024',
      time: '14:00 - 15:30',
      duration: '1.5h',
      rating: 5.0,
      price: 75,
      status: 'completed',
      topic: 'Custom hooks, compound components, and render props patterns.',
      feedback: 'Sarah is progressing quickly. Discussed real-world use cases.'
    },
    {
      id: '3',
      title: 'JavaScript ES6 Features',
      menteeName: 'John Doe',
      menteeInitials: 'JD',
      date: 'Monday, November 25, 2024',
      time: '10:00 - 11:00',
      duration: '1h',
      rating: 4.0,
      price: 50,
      status: 'completed',
      topic: 'Deep dive into arrow functions, destructuring, spread operators, and template literals.',
      feedback: 'Good progress on understanding modern JavaScript syntax.'
    }
  ];

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
};

