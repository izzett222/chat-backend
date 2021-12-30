const { config } = require('dotenv');

config();
module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL_DEV',
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'DB_TEST',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
