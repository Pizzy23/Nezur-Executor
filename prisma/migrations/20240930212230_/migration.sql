/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `Historic_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Historic` MODIFY `status` ENUM('VALID', 'INVALID', 'REFUND', 'ANALYSE') NOT NULL;
