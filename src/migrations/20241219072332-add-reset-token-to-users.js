module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('Users', 'reset_token', {
          type: Sequelize.STRING,
          allowNull: true,
      });
      await queryInterface.addColumn('Users', 'reset_token_expiry', {
          type: Sequelize.DATE,
          allowNull: true,
      });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('Users', 'reset_token');
      await queryInterface.removeColumn('Users', 'reset_token_expiry');
  },
};
