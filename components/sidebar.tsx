import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import SidebarItem from './sidebar-item';
import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs';
import { Loader } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div className={cn('flex  h-full lg:w-[256px] lg:fixed top-0 left-0 flex-col border-r-2 px-4', className)}>
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/mascot.svg" width={40} height={40} alt="face_icon" />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">Lingo</h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem label="学习" href="/learn" iconSrc="/learn.svg" />
        <SidebarItem label="排行榜" href="/leaderboard" iconSrc="/leaderboard.svg" />
        <SidebarItem label="挑战" href="/quests" iconSrc="/quests.svg" />
        <SidebarItem label="商店" href="/shop" iconSrc="/shop.svg" />
      </div>
      <div className="p-4 lg:absolute lg:bottom-0 ">
        <ClerkLoading>
          <Loader className="animate-spin h-5 w-5 text-muted-foreground" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>
    </div>
  );
};

export default Sidebar;
