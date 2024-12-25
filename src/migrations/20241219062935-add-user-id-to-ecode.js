module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('Ecodes', 'user_id', {
    //   type: Sequelize.INTEGER,
    //   allowNull: true, // Allow null initially
    //   references: {
    //     model: 'Users', // Name of the users table
    //     key: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL',
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Ecodes', 'user_id');
  },
};
