module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the Countries table
    await queryInterface.createTable('Countries', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING, // Use STRING for country ID
      },
      shortname: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      phonecode: {
        type: Sequelize.STRING, // Use STRING for phone code
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: true,
        references: {
          model: 'Currencies', // Name of the referenced table
          key: 'code',         // Column in the referenced table
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the Countries table and remove the currency column
    await queryInterface.dropTable('Countries');
  },
};
