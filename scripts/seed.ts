import 'dotenv/config';
import postgres from 'postgres';

import * as schema from '../db/schema';
import { drizzle } from 'drizzle-orm/postgres-js';

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString!);
const db = drizzle(client, { schema });

const main = async () => {
  try {
    console.log('开始填充数据');

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);

    await db.insert(schema.courses).values([
      {
        id: 1,
        title: '西班牙语',
        imageSrc: '/es.svg',
      },
      {
        id: 2,
        title: '意大利语',
        imageSrc: '/it.svg',
      },
      {
        id: 3,
        title: '法语',
        imageSrc: '/fr.svg',
      },
      {
        id: 4,
        title: '克罗地亚语',
        imageSrc: '/hr.svg',
      },
    ]);

    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1, // 西班牙语
        title: '单元 1',
        desc: '学习西班牙语基础',
        order: 1,
      },
    ]);

    await db.insert(schema.lessons).values([
      {
        id: 1,
        unitId: 1, // 单元 1 (学习基础...)
        order: 1,
        title: '名词',
      },
      {
        id: 2,
        unitId: 1, // 单元 1 (学习基础...)
        order: 2,
        title: '动词',
      },
      {
        id: 3,
        unitId: 1, // 单元 1 (学习基础...)
        order: 3,
        title: '动词',
      },
      {
        id: 4,
        unitId: 1, // 单元 1 (学习基础...)
        order: 4,
        title: '动词',
      },
      {
        id: 5,
        unitId: 1, // 单元 1 (学习基础...)
        order: 5,
        title: '动词',
      },
    ]);

    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1, // 名词
        type: 'SELECT',
        order: 1,
        question: '以下哪一个是“男人”？',
      },
      {
        id: 2,
        lessonId: 1, // 名词
        type: 'ASSIST',
        order: 2,
        question: '“男人”',
      },
      {
        id: 3,
        lessonId: 1, // 名词
        type: 'SELECT',
        order: 3,
        question: '以下哪一个是“机器人”？',
      },
    ]);

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 1, // Which one of these is "the man"?
        imageSrc: '/man.svg',
        correct: true,
        text: 'el hombre',
        audioSrc: '/es_man.mp3',
      },
      {
        challengeId: 1,
        imageSrc: '/woman.svg',
        correct: false,
        text: 'la mujer',
        audioSrc: '/es_woman.mp3',
      },
      {
        challengeId: 1,
        imageSrc: '/robot.svg',
        correct: false,
        text: 'el robot',
        audioSrc: '/es_robot.mp3',
      },
    ]);

    // await db.insert(schema.challengeOptions).values([
    //   {
    //     challengeId: 2, // "the man"?
    //     correct: true,
    //     text: 'el hombre',
    //     audioSrc: '/es_man.mp3',
    //   },
    //   {
    //     challengeId: 2,
    //     correct: false,
    //     text: 'la mujer',
    //     audioSrc: '/es_woman.mp3',
    //   },
    //   {
    //     challengeId: 2,
    //     correct: false,
    //     text: 'el robot',
    //     audioSrc: '/es_robot.mp3',
    //   },
    // ]);

    // await db.insert(schema.challengeOptions).values([
    //   {
    //     challengeId: 3, // Which one of these is the "the robot"?
    //     imageSrc: '/man.svg',
    //     correct: false,
    //     text: 'el hombre',
    //     audioSrc: '/es_man.mp3',
    //   },
    //   {
    //     challengeId: 3,
    //     imageSrc: '/woman.svg',
    //     correct: false,
    //     text: 'la mujer',
    //     audioSrc: '/es_woman.mp3',
    //   },
    //   {
    //     challengeId: 3,
    //     imageSrc: '/robot.svg',
    //     correct: true,
    //     text: 'el robot',
    //     audioSrc: '/es_robot.mp3',
    //   },
    // ]);

    // await db.insert(schema.challenges).values([
    //   {
    //     id: 4,
    //     lessonId: 2, // 动词
    //     type: 'SELECT',
    //     order: 1,
    //     question: '以下哪一个是“男人”？',
    //   },
    //   {
    //     id: 5,
    //     lessonId: 2, // 动词
    //     type: 'ASSIST',
    //     order: 2,
    //     question: '“男人”',
    //   },
    //   {
    //     id: 6,
    //     lessonId: 2, // 动词
    //     type: 'SELECT',
    //     order: 3,
    //     question: '以下哪一个是“机器人”？',
    //   },
    // ]);
    console.log('数据填充完成');
  } catch (error) {
    console.error(error);
    throw new Error('填充数据库失败');
  }
};

main();
