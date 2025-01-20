'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('TeamPlayers', 'status', {
      type: Sequelize.STRING, // You can use Sequelize.ENUM if it's a predefined set of values
      allowNull: false,
      defaultValue: 'Pending', // Set a default value
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('TeamPlayers', 'status');
  },
};
