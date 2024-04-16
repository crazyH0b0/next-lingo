'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Crown, Star } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface LessonButtonProps {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
}

const LessonButton = ({ id, index, totalCount, locked, current, percentage }: LessonButtonProps) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;

  if (cycleIndex <= 3) {
    indentationLevel = cycleIndex;
  } else {
    indentationLevel = cycleLength - cycleIndex;
  }
  const rightPostion = indentationLevel * 40;

  const isFirst = index === 0; // 判断是否为第一个按钮
  const isLast = index === totalCount; // 判断是否为最后一个按钮
  const isCompleted = !current && !locked; // 判断是否已完成

  const Icon = isCompleted ? Check : isLast ? Crown : Star;

  const href = isCompleted ? `/lesson/${id}` : '/lesson';

  return (
    <Link href={href} style={{ pointerEvents: locked ? 'none' : 'auto' }}>
      <div
        className="relative"
        style={{
          right: `${rightPostion}px`,
          marginTop: isFirst && !isCompleted ? 60 : 24,
        }}
      >
        {current ? (
          <div className="h-[102px] w-[102px] relative">
            <div
              className="absolute -top-6 left-[21px] px-3 py-2.5 border-2
              font-bold text-green-500 bg-white rounded-xl animate-bounce tracking-wide z-10
              "
            >
              开始
              <div
                className="absolute left-1/2 -bottom-2 w-0 h-0 
              border-x-8 border-x-transparent border-t-8 
              transform -translate-x-1/2 "
              />
            </div>
            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path: {
                  stroke: '#4ade80',
                },
                trail: {
                  stroke: '#e5e7eb',
                },
              }}
            >
              <Button
                size={'rounded'}
                variant={locked ? 'locked' : 'secondary'}
                className="h-[70px] w-[70px] border-b-8"
              >
                <Icon
                  className={cn(
                    'h-10 w-10',
                    locked
                      ? 'fill-neutral-400 stroke-neutral-400  text-neutral-400'
                      : 'fill-primary-foreground text-primary-foreground',
                    isCompleted && 'fill-none stroke-[4]'
                  )}
                />
              </Button>
            </CircularProgressbarWithChildren>
          </div>
        ) : (
          <Button size={'rounded'} variant={locked ? 'locked' : 'secondary'} className="h-[70px] w-[70px] border-b-8">
            <Icon
              className={cn(
                'h-10 w-10',
                locked
                  ? 'fill-neutral-400 stroke-neutral-400  text-neutral-400'
                  : 'fill-primary-foreground text-primary-foreground',
                isCompleted && 'fill-none stroke-[4]'
              )}
            />
          </Button>
        )}
      </div>
    </Link>
  );
};

export default LessonButton;
