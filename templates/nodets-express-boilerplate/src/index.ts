import type { Server } from 'node:http';
import mongoose from 'mongoose';
import app from './app';
import { env } from './config';
import { logger } from './config/logger';

let server: Server;

mongoose
  .connect(env.mongoose.url)
  .then(() => {
    logger.info('Connected to MongoDB');
    server = app.listen(env.port, () => {
      logger.info(`Listening to port ${env.port}`);
    });
  })
  .catch(() => {
    logger.error('Error connecting to MongoDB');
    process.exit(1);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', exitHandler);
