'use server';

import { POINTS_TO_REFILL } from '@/constants';
import db from '@/db/drizzle';
import { getCourseById, getUserProgress } from '@/db/queries';
import { challengeProgress, challenges, userProgress } from '@/db/schema';
import { auth, currentUser } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error('Unauthorized');

  const course = await getCourseById(courseId);

  if (!course) throw new Error('课程不存在');
  // if(!course.units.length || !course.units[0].lessons.length) throw new Error('课程为空')
  const existtingUserProgress = await getUserProgress();

  if (existtingUserProgress) {
    await db.update(userProgress).set({
      activeCourseId: courseId,
      userName: user.firstName || '用户',
      userImageSrc: user.imageUrl || '/mascot.svg',
    });

    revalidatePath('/courses');
    revalidatePath('/learn');
    redirect('/learn');
  }

  await db.insert(userProgress).values({
    userId,
    activeCourseId: courseId,
    userName: user.firstName || '用户',
    userImageSrc: user.imageUrl || '/mascot.svg',
  });

  revalidatePath('/courses');
  revalidatePath('/learn');
  redirect('/learn');
};

export const reduceHearts = async (challengeId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const currentUserProgress = await getUserProgress();

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });

  if (!challenge) {
    throw new Error('挑战不存在');
  }

  // 判断当前挑战进度是否存在
  const existtingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(eq(challengeProgress.userId, userId), eq(challengeProgress.challengeId, challengeId)),
  });

  const isPratice = !!existtingChallengeProgress;

  // 练习模式不会消耗生命值
  if (isPratice) {
    return { error: 'practice' };
  }

  if (!currentUserProgress) {
    throw new Error('用户进度不存在~');
  }

  // 生命值为 0 直接返回
  if (currentUserProgress.hearts === 0) {
    return { error: 'hearts' };
  }

  // 减少用户的生命值
  await db
    .update(userProgress)
    .set({
      hearts: Math.max(currentUserProgress.hearts - 1, 0),
    })
    .where(eq(userProgress.userId, userId));

  revalidatePath('/shop');
  revalidatePath('/learn');
  revalidatePath('/lesson');
  revalidatePath('/quests');
  revalidatePath('/leaderboard');
  revalidatePath(`/lesson/${challenge.lessonId}`);
  return;
};

export const refillHearts = async () => {
  const currentUserProgress = await getUserProgress();

  if (!currentUserProgress) throw new Error('用户进度不存在');

  if (currentUserProgress.hearts === 5) throw new Error('生命值已满');

  // 判断需要购买生命的积分是否足够
  if (currentUserProgress.points < POINTS_TO_REFILL) throw new Error('积分不足');

  await db
    .update(userProgress)
    .set({
      hearts: 5,
      points: currentUserProgress.points - POINTS_TO_REFILL,
    })
    .where(eq(userProgress.userId, currentUserProgress.userId));

  revalidatePath('/shop');
  revalidatePath('/learn');
  revalidatePath('/quests');
  revalidatePath('/leaderboard');
};
