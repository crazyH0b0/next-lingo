import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import { InfinityIcon } from 'lucide-react';
import { courses } from '@/db/schema';

interface UserProgressProps {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  hasActiveDesc: boolean;
}

const UserProgress = ({ activeCourse, hearts, points, hasActiveDesc }: UserProgressProps) => {
  return (
    <div className="flex     justify-between gap-x-2 w-full">
      <Link href="/courses">
        <Button variant={'ghost'}>
          <Image src={activeCourse.imageSrc} className="rounded-md " width={32} height={32} alt={activeCourse.title} />
        </Button>
      </Link>

      <Link href={'/shop'}>
        <Button variant={'ghost'} className="text-orange-500">
          <Image src="/points.svg" height={28} width={28} alt="得分" className="mr-2" />
          {points}
        </Button>
      </Link>

      <Link href={'/shop'}>
        <Button variant={'ghost'} className="text-rose-500">
          <Image src="/heart.svg" height={22} width={22} alt="次数" className="mr-2" />
          {hasActiveDesc ? <InfinityIcon className="w-4 h-4 stroke-[3]" /> : hearts}
        </Button>
      </Link>
    </div>
  );
};

export default UserProgress;
