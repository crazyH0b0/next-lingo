import FeedWrapper from '@/components/feed-wrapper';
import StickyWrapper from '@/components/sticky-wrapper';
import React from 'react';
import Header from './header';
import UserProgress from '@/components/user-progress';

const LearnPage = () => {
  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 ">
      <StickyWrapper>
        <UserProgress
          activeCourse={{
            title: 'Spanish',
            imageSrc: '/es.svg',
          }}
          hearts={5}
          points={100}
          hasActiveDesc={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title="Spanish" />
        <div className="h-[3000px] bg-red-400 w-full"></div>
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
