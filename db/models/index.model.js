import { Sequelize } from 'sequelize';
import url from 'url';
import allConfig from '../../config/config.cjs';

import gameModel from './game.js';
import moveModel from './move.js';
import participantModel from './participant.js';
import playerModel from './player.js';

const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};
let sequelize;

// If env is production, retrieve database auth details from the
// DATABASE_URL env var that Heroku provides us
if (env === 'production') {
  // Break apart the Heroku database url and rebuild the configs we need
  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
  const password = dbUrl.auth.substr(
    dbUrl.auth.indexOf(':') + 1,
    dbUrl.auth.length
  );
  const dbName = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
  sequelize = new Sequelize(dbName, username, password, config);
}

// If env is not production, retrieve DB auth details from the config
else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

db.Game = gameModel(sequelize, Sequelize.DataTypes);
db.Move = moveModel(sequelize, Sequelize.DataTypes);
db.Participant = participantModel(sequelize, Sequelize.DataTypes);
db.Player = playerModel(sequelize, Sequelize.DataTypes);

// Many games belong to many players
db.Game.belongsToMany(db.Player, { through: db.Participant });
// Many players belong to many games
db.Player.belongsToMany(db.Game, { through: db.Participant });
// Each game has many moves
db.Game.hasMany(db.Move);
// Each participant has many moves
db.Participant.hasMany(db.Move);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
