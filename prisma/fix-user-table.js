const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixUserTable() {
  try {
    console.log("=== Fixing User Table ===");
    
    // Check if User table exists and has the createdAt column
    console.log("Checking User table structure...");
    
    // Try to add the createdAt column if it doesn't exist
    try {
      await prisma.$executeRaw`
        ALTER TABLE "User" 
        ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
      `;
      console.log("✅ Added createdAt column to User table");
    } catch (error) {
      console.log("Column might already exist or table doesn't exist:", error.message);
    }
    
    // Check if Message and MessageRecipient tables exist
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Message" (
          "id" SERIAL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
          "senderId" TEXT NOT NULL
        )
      `;
      console.log("✅ Created Message table");
    } catch (error) {
      console.log("Message table might already exist:", error.message);
    }
    
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "MessageRecipient" (
          "id" SERIAL PRIMARY KEY,
          "messageId" INTEGER NOT NULL,
          "recipientId" TEXT NOT NULL,
          "isRead" BOOLEAN DEFAULT false,
          "readAt" TIMESTAMP(3),
          UNIQUE("messageId", "recipientId")
        )
      `;
      console.log("✅ Created MessageRecipient table");
    } catch (error) {
      console.log("MessageRecipient table might already exist:", error.message);
    }
    
    // Verify the User table structure
    try {
      const userCount = await prisma.user.count();
      console.log("✅ User table is accessible, count:", userCount);
    } catch (error) {
      console.log("❌ User table still has issues:", error.message);
    }
    
    console.log("=== User Table Fix Completed ===");
    
  } catch (error) {
    console.error("Error fixing User table:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserTable();
