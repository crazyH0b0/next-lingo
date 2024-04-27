'use client';
import { challengeOptions, challenges } from '@/db/schema';
import React from 'react';
import Header from './header';
import QuestionBubble from './question-bubble';
import Challenge from './challenge';
import Footer from './footer';
import { upsertChallengeProgress } from '@/actions/challenge-progress';
import { toast } from 'sonner';
import { reduceHearts } from '@/actions/user-progress';
import { useAudio, useMount, useWindowSize } from 'react-use';
import Image from 'next/image';
import ResultCard from './result-card';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';
import { useHeartsModal } from '@/store/use-hearts-modal';
import { usePracticeModal } from '@/store/use-practice-modal';

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
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const { open } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) openPracticeModal();
  });

  const [correctAudio, _c, correctControls] = useAudio({ src: '/correct.wav' });
  const [incorrectAudio, _i, incorrectControls] = useAudio({ src: '/incorrect.wav' });
  const [finishAudio, _f, finishAudioControls] = useAudio({ src: '/finish.mp3', autoPlay: true });
  const { width, height } = useWindowSize();

  const [lessonId, setLessonId] = React.useState(initialLessonId); // 选中的卡片
  const [selectedOption, setSelectedOption] = React.useState<number>(); // 选中的卡片
  const [hearts, setHearts] = React.useState(initialHearts); // 初始化 hearts

  const [percentage, setPercentage] = React.useState(() => {
    // 练习模式下自动清零课程进度条
    return initialPercentage === 100 ? 0 : initialPercentage;
  });

  const [challenges] = React.useState(initialChallenges);
  const [activeIndex, setActiveIndex] = React.useState(() => {
    const unCompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
    return unCompletedIndex === -1 ? 0 : unCompletedIndex;
  }); // 自动选择课程中第一个未完成的挑战
  const [status, setStatus] = React.useState<'correct' | 'wrong' | 'none'>('none');
  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti recycle={false} numberOfPieces={500} tweenDuration={10000} width={width} height={height} />
        <div className="mx-auto flex h-full max-w-2xl  flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
          <Image src="/finish.svg" alt="Finish" className="hidden lg:block" width={100} height={100} />
          <Image src="/finish.svg" alt="Finish" className="block lg:hidden" width={50} height={50} />{' '}
          <h1 className="text-xl lg:px-20 lg:text-3xl font-bold text-neutral-700">
            恭喜! <br /> 你已完成该课程!
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => {
            router.push('/learn');
          }}
        />
      </>
    );
  }

  const title = challenge.type === 'ASSIST' ? '选择正常的词语' : challenge.question;

  const onSelect = (id: number) => {
    if (status !== 'none') return;
    setSelectedOption(id);
  };

  const onNext = () => {
    setActiveIndex(activeIndex + 1);
  };

  // 选完答案后点击的逻辑
  const onContinue = () => {
    if (!selectedOption) return;
    // 答错了，重试逻辑
    if (status === 'wrong') {
      setStatus('none');
      setSelectedOption(undefined);
      return;
    }
    // 答对了，下一题逻辑
    if (status === 'correct') {
      onNext();
      setStatus('none');
      setSelectedOption(undefined);
      return;
    }

    // 点击确定的逻辑
    const correctOption = options.find((option) => option.correct);
    if (!correctOption) return;
    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            // 生命值消耗完
            if (response?.error === 'hearts') {
              open();
              return;
            }
            correctControls.play();
            setStatus('correct');
            setPercentage((prev) => prev + 100 / challenges.length);

            // 如果是 100，则代表是练习
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error('出错了，请重试~'));
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === 'hearts') {
              open();
              return;
            }

            incorrectControls.play();
            setStatus('wrong');

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error('出错了，请重试~'));
      });
    }
  };

  return (
    <>
      {incorrectAudio}
      {correctAudio}
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
                disabled={isPending}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer disabled={!selectedOption} status={status} onCheck={onContinue} />
    </>
  );
};

export default Quiz;
