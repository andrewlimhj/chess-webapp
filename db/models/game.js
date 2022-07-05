export default function gameModel(sequelize, DataTypes) {
  return sequelize.define(
    'game',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      start_time: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      end_time: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      player_start_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'players',
          key: 'id',
        },
      },
      result: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      move_time_limit: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      game_time_limit: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      room_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
    }
  );
}
