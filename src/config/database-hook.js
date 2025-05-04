const register = require('@babel/register').default;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

register({ extensions: ['.ts', '.js'] });

dotenv.config();

module.exports = require('./database');
