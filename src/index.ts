import app from './app.js';
import { config } from './config/config.js';
import prisma from './db/database.js';

const PORT = process.env.PORT || config.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
     await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${config.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️  Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⏹️  Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
