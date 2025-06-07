import type { Server } from 'node:http';
import app from './app';
import { env } from './config';
import { logger } from './config/logger';
import prisma from './lib/prisma';

let server: Server;

async function startServer() {
  try {
    await prisma.$connect();
    logger.info('Connected to PostgreSQL');

    server = app.listen(env.port, () => {
      logger.info(`Listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error('Error connecting to PostgreSQL', error);
    process.exit(1);
  }
}

startServer();

const exitHandler = async () => {
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(1);
    });
  } else {
    await prisma.$disconnect();
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', exitHandler);
