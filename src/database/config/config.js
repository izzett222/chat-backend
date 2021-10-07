const {config} = require('dotenv');

config();
module.exports = {
  development: {
    use_env_variable: 'DB_DEV',
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'DB_TEST',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DB_PROD',
    dialect: 'postgres',
  },
};
