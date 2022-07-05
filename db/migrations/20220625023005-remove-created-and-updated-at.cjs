'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('players', 'created_at');
    await queryInterface.removeColumn('players', 'updated_at');

    await queryInterface.addColumn('players', 'created_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('players', 'updated_at', {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('players', 'created_at');
    await queryInterface.removeColumn('players', 'updated_at');

    await queryInterface.addColumn('players', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('players', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },
};
