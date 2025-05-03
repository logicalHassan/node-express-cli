const mongoose = require('mongoose');
const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');

let server;
mongoose.connect(env.mongoose.url).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(env.port, () => {
    logger.info(`Listening to port ${env.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
