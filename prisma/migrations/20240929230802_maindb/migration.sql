/*
  Warnings:

  - Added the required column `isValid` to the `Historic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Historic` ADD COLUMN `isValid` BOOLEAN NOT NULL;
