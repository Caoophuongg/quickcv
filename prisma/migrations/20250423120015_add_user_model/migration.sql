/*
  Warnings:

  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "Role";
