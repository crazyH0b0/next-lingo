import FeedWrapper from '@/components/feed-wrapper';
import StickyWrapper from '@/components/sticky-wrapper';
import UserProgress from '@/components/user-progress';
import { getTopTenUsers, getUserProgress } from '@/db/queries';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';
import Items from './items';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const LeaderboardPage = async () => {
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
          <Image src={'/leaderboard.svg'} alt="Leaderboard" height={90} width={90} />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6 ">排行榜</h1>
          <p className="text-muted-foreground text-center text-lg mb-6">Spend your points on cool stuff</p>
          <Separator className="mb-4 h-0.5" />
          {leaderboard.map((userProgress, index) => (
            <div
              key={userProgress.userId}
              className="flex items-center w-full py-2 px-4 rounded-xl hover:bg-gray-200/50"
            >
              <p className="font-bold text-lime-700 mr-4">{index + 1}</p>
              <Avatar className="border bg-green-500 h-12 w-12 mr-3">
                <AvatarImage className="object-cover" src={userProgress.userImageSrc} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="font-bold text-neutral-800 flex-1">{userProgress.userName}</p>
              <p className="text-muted-foreground">{userProgress.points} XP</p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderboardPage;
