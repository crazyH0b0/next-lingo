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
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useHeartsModal } from '@/store/use-hearts-modal';

const HeartsModal = () => {
  const { isOpen, open, close } = useHeartsModal();
  const router = useRouter();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const onClick = () => {
    close();
    router.push('/store');
  };

  if (!isClient) return null;
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image src={'/mascot_bad.svg'} alt="Mascot" width={80} height={80} />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">你的生命值没有了！</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-base tracking-wide">
          升级会员，或者进入商店购买生命值
        </DialogDescription>
        <DialogFooter className=" mb-4">
          <div className="flex flex-col gap-y-4 w-full">
            <Button variant={'primary'} className="w-full" size={'lg'} onClick={onClick}>
              升级会员
            </Button>
            <Button variant={'primaryOutline'} className="w-full" size={'lg'} onClick={close}>
              不了
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HeartsModal;
