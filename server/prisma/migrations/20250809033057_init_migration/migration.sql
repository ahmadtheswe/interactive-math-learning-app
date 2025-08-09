-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lesson" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."problem" (
    "id" SERIAL NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "xpValue" INTEGER NOT NULL DEFAULT 10,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."problem_option" (
    "id" SERIAL NOT NULL,
    "problemId" INTEGER NOT NULL,
    "optionText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "problem_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."submission" (
    "id" SERIAL NOT NULL,
    "attemptId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_progress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "problemsCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalProblems" INTEGER NOT NULL DEFAULT 0,
    "progressPercent" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "lastAttemptAt" TIMESTAMP(3),

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "submission_attemptId_key" ON "public"."submission"("attemptId");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_userId_lessonId_key" ON "public"."user_progress"("userId", "lessonId");

-- AddForeignKey
ALTER TABLE "public"."problem" ADD CONSTRAINT "problem_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."problem_option" ADD CONSTRAINT "problem_option_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submission" ADD CONSTRAINT "submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submission" ADD CONSTRAINT "submission_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submission" ADD CONSTRAINT "submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_progress" ADD CONSTRAINT "user_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_progress" ADD CONSTRAINT "user_progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
