/*
  Warnings:

  - You are about to drop the `PasswordHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PasswordHistory" DROP CONSTRAINT "PasswordHistory_userId_fkey";

-- DropTable
DROP TABLE "PasswordHistory";
