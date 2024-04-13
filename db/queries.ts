import db from './drizzle';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs';
import { courses, userProgress } from './schema';

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
