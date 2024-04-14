import FeedWrapper from '@/components/feed-wrapper';
import StickyWrapper from '@/components/sticky-wrapper';
import React from 'react';
import Header from './header';
import UserProgress from '@/components/user-progress';
import { getUnits, getUserProgress } from '@/db/queries';
import { redirect } from 'next/navigation';
import Unit from './unit';

const LearnPage = async () => {
  const useProgressData = getUserProgress();
  const unitsData = getUnits();
  const [userProgress, units] = await Promise.all([useProgressData, unitsData]);

  if (!userProgress || !userProgress.activeCourse) redirect('/courses');

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 ">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveDesc={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              desc={unit.desc}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={undefined}
              activeLessonPercentage={0}
            />
          </div>
        ))}
        {/* <div className="h-[3000px]  w-full"></div> */}
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
