const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || 'Development',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: process.env.TEST_DB_USER || 'root',
    password: process.env.TEST_DB_PASS || null,
    database: process.env.TEST_DB_NAME || 'database_test',
    host: process.env.TEST_DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: process.env.PROD_DB_USER || 'root',
    password: process.env.PROD_DB_PASS || null,
    database: process.env.PROD_DB_NAME || 'database_production',
    host: process.env.PROD_DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
};
