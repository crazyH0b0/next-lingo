import { lessons, units } from '@/db/schema';
import React from 'react';
import UnitBanner from './unit-banner';
import LessonButton from './lesson-button';

interface UnitProps {
  id: number;
  order: number;
  title: string;
  desc: string;
  lessons: (typeof lessons.$inferSelect & {
    completed: boolean;
  })[];
  activeLesson:
    | (typeof lessons.$inferSelect & {
        unit: typeof units.$inferSelect;
      })
    | undefined;
  activeLessonPercentage: number;
}

const Unit = ({ id, order, title, desc, lessons, activeLesson, activeLessonPercentage }: UnitProps) => {
  return (
    <>
      <UnitBanner title={title} desc={desc} />
      <div className="flex items-center flex-col relative">
        {lessons.map((lesson, index) => {
          const isCurrent = true || lesson.id === activeLesson?.id;
          // 锁定课程未完成或者不是当前课程
          const isLocked = !lesson.completed && !isCurrent;
          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              current={isCurrent}
              locked={isLocked}
              percentage={activeLessonPercentage}
            />
          );
        })}
      </div>
    </>
  );
};

export default Unit;
