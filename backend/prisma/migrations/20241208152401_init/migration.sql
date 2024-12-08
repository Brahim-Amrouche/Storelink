-- CreateEnum
CREATE TYPE "UserTier" AS ENUM ('FREE', 'STARTER', 'ADVANCED');

-- CreateEnum
CREATE TYPE "UserSex" AS ENUM ('UNKNOWN', 'FEMALE', 'MALE');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "sex" "UserSex" NOT NULL DEFAULT 'UNKNOWN',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tier" "UserTier" NOT NULL DEFAULT 'FREE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
