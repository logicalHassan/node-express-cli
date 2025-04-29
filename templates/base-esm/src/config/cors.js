import cors from 'cors';
import config from './config.js';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? config.frontend.url : '*',
  //   optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

export default cors(corsOptions);
