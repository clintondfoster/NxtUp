/*
  Warnings:

  - You are about to drop the column `title` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "title";
