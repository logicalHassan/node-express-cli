const cors = require('cors');
const config = require('./config');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? config.frontend.url : '*',
  //   optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

module.exports = cors(corsOptions);
