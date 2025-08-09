/*
  Warnings:

  - You are about to drop the column `lastAttemptAt` on the `user_progress` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `user_progress` table. All the data in the column will be lost.
  - You are about to drop the column `problemsCompleted` on the `user_progress` table. All the data in the column will be lost.
  - You are about to drop the column `progressPercent` on the `user_progress` table. All the data in the column will be lost.
  - You are about to drop the column `totalProblems` on the `user_progress` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_progress` table. All the data in the column will be lost.
  - You are about to drop the `lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `problem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `problem_option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,lesson_id]` on the table `user_progress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lesson_id` to the `user_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_progress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."problem" DROP CONSTRAINT "problem_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "public"."problem_option" DROP CONSTRAINT "problem_option_problemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."submission" DROP CONSTRAINT "submission_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "public"."submission" DROP CONSTRAINT "submission_problemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."submission" DROP CONSTRAINT "submission_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_progress" DROP CONSTRAINT "user_progress_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_progress" DROP CONSTRAINT "user_progress_userId_fkey";

-- DropIndex
DROP INDEX "public"."user_progress_userId_lessonId_key";

-- AlterTable
ALTER TABLE "public"."user_progress" DROP COLUMN "lastAttemptAt",
DROP COLUMN "lessonId",
DROP COLUMN "problemsCompleted",
DROP COLUMN "progressPercent",
DROP COLUMN "totalProblems",
DROP COLUMN "userId",
ADD COLUMN     "last_attempt_at" TIMESTAMP(3),
ADD COLUMN     "lesson_id" INTEGER NOT NULL,
ADD COLUMN     "problems_completed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "progress_percent" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "total_problems" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."lesson";

-- DropTable
DROP TABLE "public"."problem";

-- DropTable
DROP TABLE "public"."problem_option";

-- DropTable
DROP TABLE "public"."submission";

-- DropTable
DROP TABLE "public"."user";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "best_streak" INTEGER NOT NULL DEFAULT 0,
    "last_activity_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lessons" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."problems" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "correct_answer" TEXT NOT NULL,
    "xp_value" INTEGER NOT NULL DEFAULT 10,
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."problem_options" (
    "id" SERIAL NOT NULL,
    "problem_id" INTEGER NOT NULL,
    "option_text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "problem_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."submissions" (
    "id" SERIAL NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "problem_id" INTEGER NOT NULL,
    "user_answer" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "xp_awarded" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_attempt_id_key" ON "public"."submissions"("attempt_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_user_id_lesson_id_key" ON "public"."user_progress"("user_id", "lesson_id");

-- AddForeignKey
ALTER TABLE "public"."problems" ADD CONSTRAINT "problems_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."problem_options" ADD CONSTRAINT "problem_options_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submissions" ADD CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submissions" ADD CONSTRAINT "submissions_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submissions" ADD CONSTRAINT "submissions_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_progress" ADD CONSTRAINT "user_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
