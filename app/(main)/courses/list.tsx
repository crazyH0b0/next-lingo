'use client';
import { courses, userProgress } from '@/db/schema';
import React from 'react';
import { useRouter } from 'next/navigation';
import { upsertUserProgress } from '@/actions/user-progress';
import { toast } from 'sonner';

import Card from './card';

interface ListProps {
  courses: (typeof courses.$inferSelect)[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
}

const List = ({ courses, activeCourseId }: ListProps) => {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const onClick = (id: number) => {
    if (pending) return;
    if (id === activeCourseId) {
      return router.push('/learn');
    }
    startTransition(() => {
      upsertUserProgress(id).catch(() => toast.error('出错了~'));
    });
  };
  return (
    <div
      className="pt-6  
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4"
    >
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={onClick}
          disabled={pending}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  );
};

export default List;
