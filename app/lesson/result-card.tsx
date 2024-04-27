import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

interface ResultCard {
  variant: 'points' | 'hearts';
  value: number;
}
const ResultCard = ({ variant, value }: ResultCard) => {
  const imageSrc = variant === 'hearts' ? '/heart.svg' : '/points.svg';
  return (
    <div
      className={cn(
        'w-full rounded-2xl border-2',
        variant === 'points' && 'border-orange-400 bg-orange-400',
        variant === 'hearts' && 'border-rose-500 bg-rose-500'
      )}
    >
      <div
        className={cn(
          'rounded-t-xl p-1.5 text-center text-xs font-bold uppercase text-white',
          variant === 'points' && 'bg-orange-400',
          variant === 'hearts' && 'bg-rose-500'
        )}
      >
        {variant === 'hearts' ? 'Hearts Left' : 'Total XP'}
      </div>
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl bg-white p-6 text-lg font-bold',
          variant === 'points' && 'text-orange-400',
          variant === 'hearts' && 'text-rose-500'
        )}
      >
        <Image src={imageSrc} alt="Icon" className="mr-1.5" width={30} height={30} />
        {value}
        {/* {hasActiveSubscription ? <Infinity className="size-6 shrink-0 stroke-[2]" /> : value} */}
      </div>
    </div>
  );
};

export default ResultCard;
