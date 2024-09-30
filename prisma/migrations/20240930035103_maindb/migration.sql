/*
  Warnings:

  - You are about to drop the column `isValid` on the `Historic` table. All the data in the column will be lost.
  - Added the required column `status` to the `Historic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Historic` DROP COLUMN `isValid`,
    ADD COLUMN `status` ENUM('VALID', 'INVALID', 'IN_PROGRESS', 'ANALYSE') NOT NULL;
