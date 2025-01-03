'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Subleagues', {
      sub_league_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      org_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Organizations', // Name of the referenced table
          key: 'org_id', // Key in the referenced table
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      league_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Leagues', // Name of the referenced table
          key: 'league_id', // Key in the referenced table
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      league_picture: { type: Sequelize.STRING(500), allowNull: false },
      sub_league_name: { type: Sequelize.STRING(100), allowNull: false, defaultValue: '' },
      reg_id: { type: Sequelize.INTEGER, allowNull: false },
      venue_details: { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
      venue_city: { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
      venue_state: { type: Sequelize.STRING(500), allowNull: true, defaultValue: '' },
      venue_country: { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
      venue_continent: { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
      venue_zipcode: { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
      venue_lat: { type: Sequelize.STRING(255), allowNull: false },
      venue_long: { type: Sequelize.STRING(255), allowNull: false },
      season: { type: Sequelize.DATE, allowNull: false },
      website: { type: Sequelize.STRING(100), allowNull: true, defaultValue: '' },
      category: { type: Sequelize.STRING(100), allowNull: false, defaultValue: '' },
      gender: { type: Sequelize.STRING(255), allowNull: false },
      game_format: { type: Sequelize.STRING(100), allowNull: false, defaultValue: '' },
      match_duration: { type: Sequelize.STRING(100), allowNull: false },
      minplayers_perteam: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      type_of_league_1: { type: Sequelize.STRING(50), allowNull: false, defaultValue: '' },
      type_of_league_2: { type: Sequelize.STRING(50), allowNull: false, defaultValue: '' },
      no_of_field_available: { type: Sequelize.STRING(50), allowNull: false, defaultValue: '' },
      no_of_field_competing: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      quantity_of_groups: { type: Sequelize.STRING(5), allowNull: false, defaultValue: '' },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: '' },
      first_name: { type: Sequelize.STRING(100), allowNull: true, defaultValue: '' },
      last_name: { type: Sequelize.STRING(100), allowNull: true, defaultValue: '' },
      email: { type: Sequelize.STRING(100), allowNull: true, defaultValue: '' },
      phone: { type: Sequelize.STRING(20), allowNull: true, defaultValue: '' },
      currency: { type: Sequelize.STRING(20), allowNull: true, defaultValue: '' },
      old_team: { type: Sequelize.STRING(100), allowNull: true, defaultValue: '' },
      new_team: { type: Sequelize.STRING(100), allowNull: true, defaultValue: '' },
      bank_name: { type: Sequelize.STRING(225), allowNull: true, defaultValue: '' },
      country: { type: Sequelize.STRING(100), allowNull: true, defaultValue: '' },
      address: { type: Sequelize.TEXT, allowNull: true },
      price_per_team: { type: Sequelize.DOUBLE(15, 2), allowNull: true, defaultValue: 0.0 },
      bank_acc_no: { type: Sequelize.STRING(50), allowNull: false, defaultValue: '' },
      company_name: { type: Sequelize.STRING(50), allowNull: true, defaultValue: '' },
      date_added: { type: Sequelize.DATE, allowNull: true },
      gold_finalmatches: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
      silver_finalmatches: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
      bronze_finalmatches: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
      tie_twoteams: { type: Sequelize.STRING(500), allowNull: true, defaultValue: '' },
      tie_moreteams: { type: Sequelize.STRING(500), allowNull: true, defaultValue: '' },
      yellowcards: { type: Sequelize.STRING(10), allowNull: true, defaultValue: '' },
      missedmatch: { type: Sequelize.STRING(10), allowNull: true, defaultValue: '' },
      miss_nxtmatch: { type: Sequelize.TINYINT, allowNull: true, defaultValue: 0 },
      group_allocated: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      fixture_allocated: { type: Sequelize.INTEGER, allowNull: false },
      league_unique_id: { type: Sequelize.STRING(255), allowNull: false },
      league_expired_date: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Subleagues');
  },
};
