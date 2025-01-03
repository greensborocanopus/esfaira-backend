'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('Leagues', ['reg_id'], {
      name: 'idx_reg_id'  // Non-unique index to support foreign key
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Leagues', 'idx_reg_id');
  }
};
