import { getCourses, getUserProgress } from '@/db/queries';
import React from 'react';
import List from './list';

const CoursePage = async () => {
  const courses = await getCourses();
  const useProgress = await getUserProgress();
  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700">课程</h1>
      <List courses={courses} activeCourseId={useProgress?.activeCourseId} />
    </div>
  );
};

export default CoursePage;
