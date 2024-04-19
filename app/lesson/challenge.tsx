import { challengeOptions, challenges } from '@/db/schema';
import { cn } from '@/lib/utils';
import React from 'react';
import Card from './card';

interface ChallengeProps {
  options: (typeof challengeOptions.$inferSelect)[];
  onSelect: (id: number) => void;
  status: 'correct' | 'wrong' | 'none';
  type: (typeof challenges.$inferSelect)['type'];
  selectedOption?: number;
  disabled?: boolean;
}

const Challenge = ({ options, onSelect, status, type, selectedOption, disabled }: ChallengeProps) => {
  return (
    <div
      className={cn(
        'grid gap-2',
        type === 'ASSIST' && 'grid-cols-1',
        type === 'SELECT' && 'grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]'
      )}
    >
      {options.map((option, index) => (
        <Card
          key={option.id}
          selected={selectedOption === option.id}
          id={option.id}
          text={option.text}
          audioSrc={option.audioSrc}
          imageSrc={option.imageSrc}
          shortcut={`${index + 1}`}
          onClick={() => onSelect(option.id)}
          disabled={false}
          type={type}
          status={status}
        />
      ))}
    </div>
  );
};

export default Challenge;
