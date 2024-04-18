import { challenges } from '@/db/schema';
import React from 'react';

interface CardProps {
  id: number;
  imageSrc: string | null;
  audioSrc: string | null;
  text: string;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
  status?: 'correct' | 'wrong' | 'none';
  type: (typeof challenges.$inferSelect)['type'];
}

const Card = ({ id, imageSrc, audioSrc, text, selected, disabled, onClick, status, type }: CardProps) => {
  return <div>Card</div>;
};

export default Card;
