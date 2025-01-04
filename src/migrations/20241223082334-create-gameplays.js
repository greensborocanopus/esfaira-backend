'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Gameplays', {
      game_play_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      game_plays: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '',
      },
      kick_off_time_1: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '',
      },
      kick_off_time_2: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '',
      },
      sub_league_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Subleagues', // Name of the referenced table
          key: 'sub_league_id', // Key in the referenced table
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Gameplays');
  },
};
