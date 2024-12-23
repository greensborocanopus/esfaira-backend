'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Organizations', {
      org_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      organization_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: '',
      },
      reg_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Organizations');
  },
};
