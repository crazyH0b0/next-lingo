'use client';
import { challengeOptions, challenges } from '@/db/schema';
import React from 'react';
import Header from './header';
import QuestionBubble from './question-bubble';
import Challenge from './challenge';

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
  const [challenges] = React.useState(initialChallenges);
  const [activeIndex, setActiveIndex] = React.useState(() => {
    const unCompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
    return unCompletedIndex === -1 ? 0 : unCompletedIndex;
  });
  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];
  const title = challenge.type === 'ASSIST' ? '选择正常的词语' : challenge.question;
  return (
    <>
      <Header hearts={hearts} percentage={percentage} />
      <div className="flex-1 ">
        <div className="h-full  flex items-center justify-center">
          <div
            className="lg:min-h-[350px]   lg:w-[600px] w-full px-6 lg:px-0
          flex flex-col gap-y-12  
          "
          >
            <h1
              className="text-lg lg:text-3xl text-center lg:text-start
            font-bold text-neutral-700
            "
            >
              {title}
            </h1>
            <div className="">
              {challenge.type === 'ASSIST' && <QuestionBubble question={challenge.question} />}
              <Challenge
                options={options}
                onSelect={() => {}}
                status={'none'}
                selectedOption={undefined}
                disabled={false}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quiz;
