'use client';

import { refillHearts } from '@/actions/user-progress';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';
import { toast } from 'sonner';

interface ItemsProps {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
}

const POINTS_TO_REFILL = 10;

const Items = ({ hearts, points, hasActiveSubscription }: ItemsProps) => {
  const [pending, startTransition] = React.useTransition();

  const onRefillHearts = () => {
    if (pending || hearts === 5 || points < POINTS_TO_REFILL) return;

    startTransition(() => {
      refillHearts().catch(() => toast.error('出错了'));
    });
  };
  return (
    <ul className="w-full">
      <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
        <Image src={'/heart.svg'} width={60} height={60} alt="Heart" />
        <div className="flex-1 ">
          <p className="text-neutral-700 text-base lg:text-xl font-bold">Refill hearts</p>
        </div>
        <Button onClick={onRefillHearts} disabled={hearts === 5 || points < POINTS_TO_REFILL || pending}>
          {hearts === 5 ? (
            'full'
          ) : (
            <div className="flex items-center">
              <Image src={'/points.svg'} alt="Points" width={20} height={20} />
              <p>{POINTS_TO_REFILL}</p>
            </div>
          )}
        </Button>
      </div>
    </ul>
  );
};

export default Items;
