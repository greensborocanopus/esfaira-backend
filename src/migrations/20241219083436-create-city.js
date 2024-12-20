'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Cities', {
      city_id: {
        type: Sequelize.STRING, // Ensure city_id is a string
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state_id: {
        type: Sequelize.STRING, // Match this type with the States table
        references: {
          model: 'States',
          key: 'state_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Cities');
  },
};
