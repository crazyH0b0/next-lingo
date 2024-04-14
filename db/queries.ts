import db from './drizzle';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs';
import { courses, units, userProgress, challengeProgress } from './schema';
import console from 'console';

export const getCourses = async () => {
  const data = await db.query.courses.findMany();
  return data;
};

export const getUserProgress = async () => {
  const { userId } = await auth();
  if (!userId) return null;
  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });
  return data;
};

export const getCourseById = async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  });
  return data;
};

export const getUnits = async () => {
  const { userId } = await auth();

  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) return [];

  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  // 给 lesson 添加 completed 属性
  // 一个 unit(单元) 有 多个 lessons(课程), 一个 lesson(单个课程) 有 多个 challenges(挑战)
  // 一个 challenge(单个挑战) 有 多个 challengeProgress(挑战进度)
  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      // 如果 challenges 空数组调用 every 会返回 true，所以需要判断处理
      if (lesson.challenges.length === 0) return { ...lesson, completed: false };
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        );
      });

      return { ...lesson, completed: allCompletedChallenges };
    });

    return { ...unit, lessons: lessonsWithCompletedStatus };
  });
  return normalizedData;
};
