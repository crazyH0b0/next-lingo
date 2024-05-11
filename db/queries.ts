import db from './drizzle';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs';
import { courses, units, userProgress, challengeProgress, challenges, lessons } from './schema';

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
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          challenges: {
            orderBy: (challenges, { asc }) => [asc(challenges.order)],
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

export const getCourseProgress = async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) return null;

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
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

  const firstUnCompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some((progress) => progress.completed === false)
        );
      });
    });

  return {
    activeLesson: firstUnCompletedLesson,
    activeLessonId: firstUnCompletedLesson?.id,
  };
};

export const getLesson = async (id?: number) => {
  const { userId } = await auth();

  if (!userId) return null;

  const courseProgress = await getCourseProgress();

  const lessonId = id || courseProgress?.activeLessonId;

  if (!lessonId) return null;

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });
  if (!data || !data.challenges) {
    return null;
  }

  // 对每个挑战进行归一化处理，额外返回带有 completed 的字段
  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.completed);

    return { ...challenge, completed };
  });

  return { ...data, challenges: normalizedChallenges };
};

export const getLessonPercentage = async () => {
  const courseProgress = await getCourseProgress();

  if (!courseProgress?.activeLessonId) {
    return 0;
  }

  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson) {
    return 0;
  }

  const completedChallenges = lesson.challenges.filter((challenge) => challenge.completed);
  const percentage = Math.round((completedChallenges.length / lesson.challenges.length) * 100);

  return percentage;
};

export const getTopTenUsers = async () => {
  const { userId } = await auth();

  if (!userId) return [];

  const data = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
    limit: 10,
    columns: {
      userId: true,
      userName: true,
      userImageSrc: true,
      points: true,
    },
  });
  return data;
};
