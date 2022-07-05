'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('games', 'created_at', {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('games', 'updated_at', {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('games', 'created_at');
    await queryInterface.removeColumn('games', 'updated_at');
  },
};
