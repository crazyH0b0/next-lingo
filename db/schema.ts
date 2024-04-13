import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  imageSrc: text('image_src').notNull(),
});

// 这表示 courses 到 userProgress 的一对多关系。每个课程可以与多个用户进度记录相关联。
export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  // units: many(units),
}));

export const userProgress = pgTable('user_progress', {
  userId: text('user_id').primaryKey(),
  userName: text('user_name').notNull().default('User'),
  userImageSrc: text('user_image_src').notNull().default('/mascot.svg'),
  activeCourseId: integer('active_course_id').references(() => courses.id, { onDelete: 'cascade' }),
  hearts: integer('hearts').notNull().default(5),
  points: integer('points').notNull().default(0),
});

//  这建立了 userProgress 和 courses 之间的一对一关系。
//  fields 和 references 数组将 userProgress.activeCourseId 与 courses.id 配对，
//  表示每个 userProgress 记录通过其 activeCourseId 与确切一个课程链接。
export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));
