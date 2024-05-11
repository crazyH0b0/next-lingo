import FeedWrapper from '@/components/feed-wrapper';
import StickyWrapper from '@/components/sticky-wrapper';
import UserProgress from '@/components/user-progress';
import { getTopTenUsers, getUserProgress } from '@/db/queries';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { quests } from '@/constants';

const QuestsPage = async () => {
  const userProgressData = getUserProgress();
  const topTenUsersData = getTopTenUsers();
  const [userProgress, leaderboard] = await Promise.all([userProgressData, topTenUsersData]);

  if (!userProgress || !userProgress.activeCourse) redirect('/courses');

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveDesc={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image src={'/quests.svg'} alt="Quests" height={90} width={90} />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6 ">挑战</h1>
          <p className="text-muted-foreground text-center text-lg mb-6">通过完成挑战获取积分</p>
          <ul className="w-full">
            {quests.map((quest, index) => {
              const progress = (userProgress.points / quest.value) * 100;
              return (
                <div key={quest.title} className="flex items-center w-full p-4 gap-x-4 border-t-2">
                  <Image src={'/points.svg'} alt="points" width={60} height={60} />
                  <div className="flex flex-col gap-y-2 w-full">
                    <p className="text-neutral-700 text-xl font-bold">{quest.title}</p>
                    <Progress value={progress} className="h-3" />
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;
