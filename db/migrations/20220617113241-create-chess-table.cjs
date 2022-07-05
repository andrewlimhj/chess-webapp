module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      user_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      photo: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      rating: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.createTable('games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      start_time: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      end_time: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      player_start_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'players',
          key: 'id',
        },
      },
      result: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      move_time_limit: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      game_time_limit: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    });

    await queryInterface.createTable('participants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      player_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'players',
          key: 'id',
        },
      },
      game_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'games',
          key: 'id',
        },
      },
      score: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('moves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      game_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'games',
          key: 'id',
        },
      },
      participant_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'participants',
          key: 'id',
        },
      },
      move_order: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      fen: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      from_position: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      to_position: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      color: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      san: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      captured: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('players', null, {});
    await queryInterface.dropTable('games', null, {});
    await queryInterface.dropTable('participants', null, {});
    await queryInterface.dropTable('moves', null, {});
  },
};
