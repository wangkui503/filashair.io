-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT DEFAULT 'regular',
    "name" TEXT,
    "password" TEXT,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mount" (
    "id" SERIAL NOT NULL,
    "alias" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "xfer_addr" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "jwttoken" TEXT,
    "privatekey" TEXT NOT NULL,
    "pubKey" TEXT NOT NULL,
    "kid" TEXT,
    "createdby" TEXT,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inbox" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "mount_id" INTEGER NOT NULL,
    "share" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdby" TEXT,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT,
    "specs" TEXT,
    "error" TEXT,
    "createdby" TEXT,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "direction" TEXT,
    "tos" TEXT,
    "subject" TEXT,
    "message" TEXT,
    "specs" TEXT,
    "threadID" TEXT,
    "expire" TEXT,
    "error" TEXT,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Recipient" (
    "id" SERIAL NOT NULL,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "specs" TEXT,
    "expire" TEXT,
    "error" TEXT,
    "expireat" TIMESTAMP(3),
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shared" (
    "id" SERIAL NOT NULL,
    "alias" TEXT,
    "desc" TEXT,
    "email" TEXT NOT NULL,
    "mount_id" INTEGER NOT NULL,
    "share" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL,
    "write" BOOLEAN NOT NULL,
    "list" BOOLEAN NOT NULL,
    "delete" BOOLEAN NOT NULL,
    "updatedby" TEXT,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shared_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "shared_id" INTEGER NOT NULL,
    "expireat" TIMESTAMP(3),
    "createdby" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mount_email_host_username_key" ON "Mount"("email", "host", "username");

-- CreateIndex
CREATE UNIQUE INDEX "Inbox_email_key" ON "Inbox"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Inbox_email_mount_id_share_path_key" ON "Inbox"("email", "mount_id", "share", "path");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- CreateIndex
CREATE INDEX "Message_updatedat_idx" ON "Message"("updatedat" DESC);

-- CreateIndex
CREATE INDEX "Recipient_updatedat_idx" ON "Recipient"("updatedat" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Recipient_email_message_id_key" ON "Recipient"("email", "message_id");

-- CreateIndex
CREATE UNIQUE INDEX "Shared_email_mount_id_share_key" ON "Shared"("email", "mount_id", "share");

-- CreateIndex
CREATE UNIQUE INDEX "SharedUser_email_shared_id_key" ON "SharedUser"("email", "shared_id");

-- AddForeignKey
ALTER TABLE "Mount" ADD CONSTRAINT "Mount_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_mount_id_fkey" FOREIGN KEY ("mount_id") REFERENCES "Mount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipient" ADD CONSTRAINT "Recipient_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shared" ADD CONSTRAINT "Shared_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shared" ADD CONSTRAINT "Shared_mount_id_fkey" FOREIGN KEY ("mount_id") REFERENCES "Mount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedUser" ADD CONSTRAINT "SharedUser_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedUser" ADD CONSTRAINT "SharedUser_shared_id_fkey" FOREIGN KEY ("shared_id") REFERENCES "Shared"("id") ON DELETE CASCADE ON UPDATE CASCADE;
