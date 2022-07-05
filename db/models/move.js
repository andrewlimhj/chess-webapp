export default function moveModel(sequelize, DataTypes) {
  return sequelize.define(
    'move',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      game_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'games',
          key: 'id',
        },
      },
      participant_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'participants',
          key: 'id',
        },
      },
      move_order: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      fen: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      from_position: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      to_position: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      color: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      san: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      captured: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    { underscored: true }
  );
}
