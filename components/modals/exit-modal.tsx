'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useExitModal } from '@/store/use-exit-modal';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '../ui/button';

const ExitModal = () => {
  const { isOpen, open, close } = useExitModal();
  const router = useRouter();
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
            <Image src={'/mascot_sad.svg'} alt="Mascot" width={80} height={80} />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">等等，别走！</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-base tracking-wide">你确定要离开该课程吗？</DialogDescription>
        <DialogFooter className=" mb-4">
          <div className="flex flex-col gap-y-4 w-full">
            <Button variant={'primary'} className="w-full" size={'lg'} onClick={close}>
              继续学习
            </Button>
            <Button
              variant={'dangerOutline'}
              className="w-full"
              size={'lg'}
              onClick={() => {
                close();
                router.push('/learn');
              }}
            >
              离开课程
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExitModal;
