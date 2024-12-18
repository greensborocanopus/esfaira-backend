'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Leagues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organization: {
        type: Sequelize.STRING
      },
      league: {
        type: Sequelize.STRING
      },
      sports_complex: {
        type: Sequelize.STRING
      },
      venue: {
        type: Sequelize.STRING
      },
      season: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      game_format: {
        type: Sequelize.STRING
      },
      minimum_players_per_team: {
        type: Sequelize.INTEGER
      },
      league_price_per_team: {
        type: Sequelize.DECIMAL
      },
      match_duration: {
        type: Sequelize.STRING
      },
      type_of_league: {
        type: Sequelize.STRING
      },
      number_of_fields_available: {
        type: Sequelize.INTEGER
      },
      number_of_teams_competing: {
        type: Sequelize.INTEGER
      },
      bank_name: {
        type: Sequelize.STRING
      },
      beneficiary_bank_account_number: {
        type: Sequelize.STRING
      },
      company_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Leagues');
  }
};