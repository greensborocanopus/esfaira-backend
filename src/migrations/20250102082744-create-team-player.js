'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create TeamPlayers table
    await queryInterface.createTable('TeamPlayers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Teams', // Name of the Teams table
          key: 'id', // Primary key in the Teams table
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Assuming players are also users
          key: 'id', // Primary key in the Users table
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      jersey_no: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_invitation_sent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      player_confirm_status: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Status of player confirmation (e.g., pending, confirmed, declined)',
      },
      payment_status: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Status of payment (e.g., paid, unpaid)',
      },
      is_team_manager: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      player_confirm_playing: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    // Drop TeamPlayers table
    await queryInterface.dropTable('TeamPlayers');
  },
};