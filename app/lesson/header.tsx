import { X } from 'lucide-react';
import React from 'react';

import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { useExitModal } from '@/store/use-exit-modal';

interface HeaderProps {
  hearts: number;
  percentage: number;
}

const Header = ({ hearts, percentage }: HeaderProps) => {
  const { open } = useExitModal();
  return (
    <header
      className="lg:pt-[50px] pt-[20px]  px-10 
  flex gap-x-7 items-center  max-w-[1140px] mx-auto w-full"
    >
      <X className="text-slate-500 hover:opacity-75 transition cursor-pointer" onClick={open} />
      <Progress value={percentage} />
      <div className="text-rose-500 flex items-center font-bold">
        <Image src={'/heart.svg'} width={28} height={28} alt="Heart" className="mr-2" />
        {hearts}
      </div>
    </header>
  );
};

export default Header;
