import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // 1. USERS (upsert by email to avoid duplicates)
  const userData = [
    {
      name: "User 1",
      email: "user1@ahmadtheswe.com",
      totalXp: 0,
      currentStreak: 0,
      bestStreak: 0,
    },
    {
      name: "User 2",
      email: "user2@ahmadtheswe.com",
      totalXp: 0,
      currentStreak: 0,
      bestStreak: 0,
    },
    {
      name: "User 3",
      email: "user3@ahmadtheswe.com",
      totalXp: 0,
      currentStreak: 0,
      bestStreak: 0,
    },
  ];

  for (const u of userData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        totalXp: u.totalXp,
        currentStreak: u.currentStreak,
        bestStreak: u.bestStreak,
      },
      create: u,
    });
  }
  console.log(`- Users seeded (${userData.length})`);

  // 2. LESSONS + PROBLEMS + OPTIONS (no @unique on title)
  const lessonsData = [
    {
      title: "Basic Arithmetic",
      description: "Addition and subtraction problems",
      problems: [
        {
          type: "multiple_choice",
          question: "What is 2 + 3?",
          correctAnswer: "5",
          xpValue: 10,
          options: ["4", "5", "6", "7"],
        },
        {
          type: "input",
          question: "Solve: 10 - 4",
          correctAnswer: "6",
          xpValue: 10,
        },
        {
          type: "multiple_choice",
          question: "What is 7 + 8?",
          correctAnswer: "15",
          xpValue: 10,
          options: ["14", "15", "16", "17"],
        },
      ],
    },
    {
      title: "Multiplication Mastery",
      description: "Times tables practice",
      problems: [
        {
          type: "multiple_choice",
          question: "What is 3 × 4?",
          correctAnswer: "12",
          xpValue: 10,
          options: ["10", "11", "12", "13"],
        },
        {
          type: "input",
          question: "Solve: 8 × 7",
          correctAnswer: "56",
          xpValue: 10,
        },
        {
          type: "multiple_choice",
          question: "What is 9 × 6?",
          correctAnswer: "54",
          xpValue: 10,
          options: ["54", "56", "58", "60"],
        },
      ],
    },
    {
      title: "Division Basics",
      description: "Simple division problems",
      problems: [
        {
          type: "multiple_choice",
          question: "What is 12 ÷ 4?",
          correctAnswer: "3",
          xpValue: 10,
          options: ["2", "3", "4", "5"],
        },
        {
          type: "input",
          question: "Solve: 20 ÷ 5",
          correctAnswer: "4",
          xpValue: 10,
        },
        {
          type: "multiple_choice",
          question: "What is 45 ÷ 9?",
          correctAnswer: "5",
          xpValue: 10,
          options: ["4", "5", "6", "7"],
        },
      ],
    },
    {
      title: "Fractions Fun",
      description: "Learn basic fractions",
      problems: [
        {
          type: "multiple_choice",
          question: "1/2 + 1/2 = ?",
          correctAnswer: "1",
          xpValue: 10,
          options: ["1/2", "1", "2"],
        },
        {
          type: "input",
          question: "Solve: 3/4 - 1/4",
          correctAnswer: "1/2",
          xpValue: 10,
        },
        {
          type: "multiple_choice",
          question: "Which is bigger: 2/3 or 3/5?",
          correctAnswer: "2/3",
          xpValue: 10,
          options: ["2/3", "3/5"],
        },
      ],
    },
    {
      title: "Algebra Basics",
      description: "Intro to algebra problems",
      problems: [
        {
          type: "multiple_choice",
          question: "If x = 2, what is x + 3?",
          correctAnswer: "5",
          xpValue: 10,
          options: ["4", "5", "6"],
        },
        {
          type: "input",
          question: "Solve for y: y - 4 = 6",
          correctAnswer: "10",
          xpValue: 10,
        },
        {
          type: "multiple_choice",
          question: "If 2x = 8, x = ?",
          correctAnswer: "4",
          xpValue: 10,
          options: ["2", "3", "4", "5"],
        },
      ],
    },
  ];

  for (const lessonData of lessonsData) {
    let existingLesson = await prisma.lesson.findFirst({
      where: { title: lessonData.title },
    });

    if (!existingLesson) {
      existingLesson = await prisma.lesson.create({
        data: {
          title: lessonData.title,
          description: lessonData.description,
          problems: {
            create: lessonData.problems.map((p) => ({
              type: p.type,
              question: p.question,
              correctAnswer: p.correctAnswer,
              xpValue: p.xpValue,
              options: p.options
                ? {
                    create: p.options.map((opt) => ({
                      optionText: opt,
                      isCorrect: opt === p.correctAnswer,
                    })),
                  }
                : undefined,
            })),
          },
        },
      });
      console.log(`- Created lesson: ${existingLesson.title}`);
    } else {
      console.log(`! Lesson already exists: ${existingLesson.title}`);
    }
  }

  console.log("- Lessons and problems seeded");
}

main()
  .then(async () => {
    console.log("Seeding completed!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
