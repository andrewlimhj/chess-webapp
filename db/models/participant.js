export default function participantModel(sequelize, DataTypes) {
  return sequelize.define(
    'participant',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      player_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'players',
          key: 'id',
        },
      },
      game_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'games',
          key: 'id',
        },
      },
      score: {
        allowNull: true,
        type: DataTypes.FLOAT,
      },
    },
    { underscored: true }
  );
}
