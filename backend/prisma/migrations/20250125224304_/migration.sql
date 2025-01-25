-- CreateTable
CREATE TABLE "FileTag" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "FileTag_pkey" PRIMARY KEY ("id")
);
