'use server';

import db from '@/db/drizzle';
import { getUserProgress } from '@/db/queries';
import { challengeProgress, challenges, userProgress } from '@/db/schema';
import { auth } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';

export const ChallengeProgress = async (challengedId: number) => {
  const { userId } = await auth();

  if (!userId) throw new Error('Unauthorized');

  const currentProgress = await getUserProgress();

  if (!currentProgress) throw new Error('进度不存在');

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengedId),
  });

  if (!challenge) throw new Error('挑战不存在');

  const { lessonId } = challenge;

  const existtingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(eq(challengeProgress.challengeId, challenge.id), eq(challengeProgress.userId, userId)),
  });

  // 当前用户是否在进行该挑战
  const isPratice = !!existtingChallengeProgress;

  if (currentProgress.hearts === 0 && !isPratice) {
    return { error: 'hearts' };
  }

  if (isPratice) {
    await db
      .update(challengeProgress)
      .set({
        completed: true,
      })
      .where(eq(challengeProgress.id, existtingChallengeProgress.id));

    await db.update(userProgress).set({
      hearts: Math.min(currentProgress.hearts + 1, 5),
    });
  }
};
