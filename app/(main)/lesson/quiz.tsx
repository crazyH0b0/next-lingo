'use client';
import { challengeOptions, challenges } from '@/db/schema';
import React from 'react';
import Header from './header';

interface QuizProps {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
}

const Quiz = ({ initialPercentage, initialHearts, initialLessonId, initialChallenges }: QuizProps) => {
  const [hearts, setHears] = React.useState(initialHearts);
  const [percentage, setPercentage] = React.useState(initialPercentage);

  return (
    <>
      <Header hearts={hearts} percentage={percentage} />
    </>
  );
};

export default Quiz;
