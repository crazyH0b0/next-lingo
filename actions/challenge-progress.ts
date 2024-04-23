'use server';

import db from '@/db/drizzle';
import { getUserProgress } from '@/db/queries';
import { challengeProgress, challenges, userProgress } from '@/db/schema';
import { auth } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const upsertChallengeProgress = async (challengeId: number) => {
  const { userId } = await auth();

  if (!userId) throw new Error('Unauthorized');

  const currentProgress = await getUserProgress();

  if (!currentProgress) throw new Error('进度不存在');

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });

  if (!challenge) throw new Error('挑战不存在');

  const { lessonId } = challenge;

  const existtingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(eq(challengeProgress.challengeId, challenge.id), eq(challengeProgress.userId, userId)),
  });

  const isPratice = !!existtingChallengeProgress;

  if (currentProgress.hearts === 0 && !isPratice) {
    return { error: 'hearts' };
  }

  // 当前用户是否在进行练习模式
  if (isPratice) {
    await db
      .update(challengeProgress)
      .set({
        completed: true,
      })
      .where(eq(challengeProgress.id, existtingChallengeProgress.id));

    await db
      .update(userProgress)
      .set({
        // 防止 hearts 超出 5
        hearts: Math.min(currentProgress.hearts + 1, 5),
        points: currentProgress.points + 10,
      })
      .where(eq(userProgress.userId, userId));

    // 所有用到 points 、 hearts 、当前 lesson 的页面都会更新
    revalidatePath('/learn');
    revalidatePath('/lesson');
    revalidatePath('/quests');
    revalidatePath('/leaderboard');
    revalidatePath(`/lesson/${lessonId}`);
    return;
  }
  await db.insert(challengeProgress).values({
    challengeId,
    userId,
    completed: true,
  });

  await db
    .update(userProgress)
    .set({
      points: currentProgress.points + 10,
    })
    .where(eq(userProgress.userId, userId));
  revalidatePath('/learn');
  revalidatePath('/lesson');
  revalidatePath('/quests');
  revalidatePath('/leaderboard');
  revalidatePath(`/lesson/${lessonId}`);
  return;
};
