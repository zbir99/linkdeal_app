import { FunctionComponent } from 'react';
import { SessionCard } from './SessionCard';

interface Session {
  id: string;
  title: string;
  status: 'completed' | 'cancelled' | 'scheduled';
  date: string;
  time: string;
  duration: string;
  rating: number;
  topic: string;
  feedback: string;
}

export const SessionHistoryList: FunctionComponent = () => {
  const sessions: Session[] = [
    {
      id: '1',
      title: 'React Fundamentals',
      status: 'completed',
      date: 'Monday, November 25, 2024',
      time: '09:00 - 10:00',
      duration: '1h',
      rating: 5.0,
      topic: 'Introduction to React components, props, and state management. Covered basic hooks like useState and useEffect.',
      feedback: 'John showed great understanding of the concepts. Recommended practice with building a todo app.'
    },
    {
      id: '2',
      title: 'JavaScript ES6 Features',
      status: 'completed',
      date: 'Wednesday, November 20, 2024',
      time: '14:00 - 15:00',
      duration: '1h',
      rating: 4.0,
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

