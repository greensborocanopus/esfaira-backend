'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Countries', 'currency', {
      type: Sequelize.STRING(3),
      allowNull: true,
      references: {
        model: 'Currencies', // Name of the referenced table
        key: 'code',         // Column in the referenced table
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Countries', 'currency');
  },
};
