-- CreateTable
CREATE TABLE "SOSAlert" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "SOSAlert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SOSAlert" ADD CONSTRAINT "SOSAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
