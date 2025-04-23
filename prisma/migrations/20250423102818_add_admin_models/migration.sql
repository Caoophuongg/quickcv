-- CreateTable
CREATE TABLE "admin_actions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_actions_pkey" PRIMARY KEY ("id")
);
