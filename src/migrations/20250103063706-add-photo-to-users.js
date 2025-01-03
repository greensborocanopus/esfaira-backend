'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'photo', {
      type: Sequelize.STRING(255),
      allowNull: true, // Allow null to make this field optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'photo');
  },
};
