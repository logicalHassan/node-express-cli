import express from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import httpStatus from 'http-status';
import routes from './routes/index.js';
import config from './config/config.js';
import morgan from './config/morgan.js';
import corsConfig from './config/cors.js';
import authLimiter from './middlewares/rateLimiter.js';
import { errorConverter, errorHandler } from './middlewares/error.js';
import { ApiError } from './utils/index.js';

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
// TODO: sanitize xss requests
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(corsConfig);
app.options('*', corsConfig);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/api/auth', authLimiter);
}

// api routes
app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Route not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
