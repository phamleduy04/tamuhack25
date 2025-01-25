/*
  Warnings:

  - A unique constraint covering the columns `[filename]` on the table `FileTag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FileTag_filename_key" ON "FileTag"("filename");
