'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('VideoRatings', {
      auto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      video_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Videos', // Name of the Videos table
          key: 'video_id', // Primary key in the Videos table
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Name of the Users table
          key: 'id', // Primary key in the Users table
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      is_liked: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0,
        comment: '1-liked',
      },
      rating: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('VideoRatings');
  },
};
