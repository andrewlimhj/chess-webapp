export default function playerModel(sequelize, DataTypes) {
  return sequelize.define(
    'player',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      user_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      photo: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      rating: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      underscored: true,
    }
  );
}
