require('dotenv').config();

module.exports = {
  development: {
    username: 'andrewlim',
    password: null,
    database: 'chess_app',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        // https://github.com/sequelize/sequelize/issues/12083
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
