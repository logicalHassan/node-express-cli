const cors = require('cors');
const env = require('./env');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? env.frontend.url : '*',
  //   optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

module.exports = cors(corsOptions);
