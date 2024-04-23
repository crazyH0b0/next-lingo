'use server';

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

  const existtingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(eq(challengeProgress.userId, userId), eq(challengeProgress.challengeId, challengeId)),
  });

  const isPratice = !!existtingChallengeProgress;

  if (isPratice) {
    return { error: 'practice' };
  }
  if (!currentUserProgress) {
    throw new Error('用户进度不存在~');
  }

  if (currentUserProgress.hearts === 0) {
    return { error: 'hearts' };
  }

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
