/*
  Warnings:

  - A unique constraint covering the columns `[attempt_id,problem_id]` on the table `submissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."submissions_attempt_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "submissions_attempt_id_problem_id_key" ON "public"."submissions"("attempt_id", "problem_id");
