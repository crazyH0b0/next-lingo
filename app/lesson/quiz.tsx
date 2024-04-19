'use client';
import { challengeOptions, challenges } from '@/db/schema';
import React from 'react';
import Header from './header';
import QuestionBubble from './question-bubble';
import Challenge from './challenge';
import Footer from './footer';

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
  const [selectedOption, setSelectedOption] = React.useState<number>(); // 选中的卡片
  const [hearts, setHears] = React.useState(initialHearts);
  const [percentage, setPercentage] = React.useState(initialPercentage);
  const [challenges] = React.useState(initialChallenges);
  const [activeIndex, setActiveIndex] = React.useState(() => {
    const unCompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
    return unCompletedIndex === -1 ? 0 : unCompletedIndex;
  }); // 自动选择课程中第一个未完成的挑战
  const [status, setStatus] = React.useState<'correct' | 'wrong' | 'none'>('none');
  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];
  const title = challenge.type === 'ASSIST' ? '选择正常的词语' : challenge.question;

  const onSelect = (id: number) => {
    if (status !== 'none') return;
    setSelectedOption(id);
  };

  const onCheck = () => {
    const option = options.find((option) => option.id === selectedOption);
    console.log({ anser: option?.correct });

    setStatus(option?.correct === true ? 'correct' : 'wrong');
  };

  return (
    <>
      <Header hearts={hearts} percentage={percentage} />
      <div className="flex-1 ">
        <div className="h-full  flex items-center justify-center">
          <div
            className="lg:w-[600px]  w-full px-6 lg:px-0
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
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={false}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer disabled={!selectedOption} status={status} onCheck={onCheck} />
    </>
  );
};

export default Quiz;
