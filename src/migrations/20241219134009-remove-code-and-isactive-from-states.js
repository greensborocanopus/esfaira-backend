'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove columns only if they exist
    const tableInfo = await queryInterface.describeTable('States');
    if (tableInfo.iso2) {
      await queryInterface.removeColumn('States', 'iso2');
    }
    if (tableInfo.is_active) {
      await queryInterface.removeColumn('States', 'is_active');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Re-add columns during rollback if needed
    await queryInterface.addColumn('States', 'iso2', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('States', 'is_active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },
};
