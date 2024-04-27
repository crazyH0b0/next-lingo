'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '../ui/button';
import { usePracticeModal } from '@/store/use-practice-modal';

const PracticeModal = () => {
  const { isOpen, open, close } = usePracticeModal();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image src={'/heart.svg'} alt="Heart" width={100} height={100} />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">练习课程</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-base tracking-wide">
          通过练习课程可以获得生命值和积分。在练习课程中，不会失去生命值或者积分
        </DialogDescription>
        <DialogFooter className=" mb-4">
          <div className="flex flex-col gap-y-4 w-full">
            <Button variant={'primary'} className="w-full" size={'lg'} onClick={close}>
              知道了
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PracticeModal;
