import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. USERS (upsert by email to avoid duplicates)
  const userData = [
    { name: "User 1", email: "user1@ahmadtheswe.com" },
    { name: "User 2", email: "user2@ahmadtheswe.com" },
    { name: "User 3", email: "user3@ahmadtheswe.com" }
  ];

  for (const u of userData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name },
      create: u
    });
  }
  console.log(`✅ Users seeded (${userData.length})`);

  // 2. LESSONS + PROBLEMS + OPTIONS (no @unique on title)
  const lessonsData = [
    {
      title: "Basic Arithmetic",
      description: "Addition and subtraction problems",
      problems: [
        { type: "multiple_choice", question: "What is 2 + 3?", correctAnswer: "5", xpValue: 10, options: ["4", "5", "6", "7"] },
        { type: "input", question: "Solve: 10 - 4", correctAnswer: "6", xpValue: 10 },
        { type: "multiple_choice", question: "What is 7 + 8?", correctAnswer: "15", xpValue: 10, options: ["14", "15", "16", "17"] }
      ]
    },
    {
      title: "Multiplication Mastery",
      description: "Times tables practice",
      problems: [
        { type: "multiple_choice", question: "What is 3 × 4?", correctAnswer: "12", xpValue: 10, options: ["10", "11", "12", "13"] },
        { type: "input", question: "Solve: 8 × 7", correctAnswer: "56", xpValue: 10 },
        { type: "multiple_choice", question: "What is 9 × 6?", correctAnswer: "54", xpValue: 10, options: ["54", "56", "58", "60"] }
      ]
    },
    {
      title: "Division Basics",
      description: "Simple division problems",
      problems: [
        { type: "multiple_choice", question: "What is 12 ÷ 4?", correctAnswer: "3", xpValue: 10, options: ["2", "3", "4", "5"] },
        { type: "input", question: "Solve: 20 ÷ 5", correctAnswer: "4", xpValue: 10 },
        { type: "multiple_choice", question: "What is 45 ÷ 9?", correctAnswer: "5", xpValue: 10, options: ["4", "5", "6", "7"] }
      ]
    },
    {
      title: "Fractions Fun",
      description: "Learn basic fractions",
      problems: [
        { type: "multiple_choice", question: "1/2 + 1/2 = ?", correctAnswer: "1", xpValue: 10, options: ["1/2", "1", "2"] },
        { type: "input", question: "Solve: 3/4 - 1/4", correctAnswer: "1/2", xpValue: 10 },
        { type: "multiple_choice", question: "Which is bigger: 2/3 or 3/5?", correctAnswer: "2/3", xpValue: 10, options: ["2/3", "3/5"] }
      ]
    },
    {
      title: "Algebra Basics",
      description: "Intro to algebra problems",
      problems: [
        { type: "multiple_choice", question: "If x = 2, what is x + 3?", correctAnswer: "5", xpValue: 10, options: ["4", "5", "6"] },
        { type: "input", question: "Solve for y: y - 4 = 6", correctAnswer: "10", xpValue: 10 },
        { type: "multiple_choice", question: "If 2x = 8, x = ?", correctAnswer: "4", xpValue: 10, options: ["2", "3", "4", "5"] }
      ]
    }
  ];

  for (const lessonData of lessonsData) {
    let existingLesson = await prisma.lesson.findFirst({
      where: { title: lessonData.title }
    });

    if (!existingLesson) {
      existingLesson = await prisma.lesson.create({
        data: {
          title: lessonData.title,
          description: lessonData.description,
          problems: {
            create: lessonData.problems.map(p => ({
              type: p.type,
              question: p.question,
              correctAnswer: p.correctAnswer,
              xpValue: p.xpValue,
              options: p.options
                ? { create: p.options.map(opt => ({
                    optionText: opt,
                    isCorrect: opt === p.correctAnswer
                  })) }
                : undefined
            }))
          }
        }
      });
      console.log(`✅ Created lesson: ${existingLesson.title}`);
    } else {
      console.log(`ℹ️ Lesson already exists: ${existingLesson.title}`);
    }
  }

  // 3. SUBMISSIONS + USER PROGRESS
  const allLessons = await prisma.lesson.findMany({ include: { problems: true } });
  const allUsers = await prisma.user.findMany();

  for (const user of allUsers) {
    for (const lesson of allLessons) {
      let correctCount = 0;

      for (const problem of lesson.problems) {
        const isCorrect = Math.random() > 0.3; // ~70% correct answers
        if (isCorrect) correctCount++;

        await prisma.submission.upsert({
          where: {
            attemptId: `${user.id}-${lesson.id}-${problem.id}`
          },
          update: {},
          create: {
            attemptId: `${user.id}-${lesson.id}-${problem.id}`,
            userId: user.id,
            lessonId: lesson.id,
            problemId: problem.id,
            userAnswer: isCorrect ? problem.correctAnswer : "wrong_answer",
            isCorrect,
            xpAwarded: isCorrect ? problem.xpValue : 0
          }
        });
      }

      await prisma.userProgress.upsert({
        where: {
          userId_lessonId: {
            userId: user.id,
            lessonId: lesson.id
          }
        },
        update: {
          problemsCompleted: lesson.problems.length,
          totalProblems: lesson.problems.length,
          progressPercent: (correctCount / lesson.problems.length) * 100,
          completed: correctCount === lesson.problems.length,
          lastAttemptAt: new Date()
        },
        create: {
          userId: user.id,
          lessonId: lesson.id,
          problemsCompleted: lesson.problems.length,
          totalProblems: lesson.problems.length,
          progressPercent: (correctCount / lesson.problems.length) * 100,
          completed: correctCount === lesson.problems.length,
          lastAttemptAt: new Date()
        }
      });

      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalXp: { increment: correctCount * 10 },
          lastActivityDate: new Date()
        }
      });
    }
  }

  console.log("✅ Submissions and progress seeded");
}

main()
  .then(async () => {
    console.log("🎉 Seeding completed!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
