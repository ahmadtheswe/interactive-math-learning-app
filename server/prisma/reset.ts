import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log("Starting database reset...");

  try {
    // Delete in reverse order of dependencies
    await prisma.submission.deleteMany();
    console.log("- Cleared submissions");

    await prisma.userProgress.deleteMany();
    console.log("- Cleared user progress");

    // await prisma.problemOption.deleteMany();
    // console.log("- Cleared problem options");

    // await prisma.problem.deleteMany();
    // console.log("- Cleared problems");

    // await prisma.lesson.deleteMany();
    // console.log("- Cleared lessons");

    // Reset user stats but keep users
    await prisma.user.updateMany({
      data: {
        totalXp: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastActivityDate: null,
      },
    });
    console.log("- Reset user stats");

    console.log("Database reset completed!");
  } catch (error) {
    console.error("Error resetting database:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  resetDatabase()
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error(error);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { resetDatabase };
