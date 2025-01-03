'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Joinleagues', {
      join_league_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      sub_league_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Subleagues', key: 'sub_league_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Teams', key: 'id' }, // Foreign key reference to Teams table
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      league_admin_reg_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Leagues', key: 'reg_id' }, // Foreign key reference to Leagues table
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      requested_reg_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }, // Reference to the Users table (logged in user)
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 0, // 0-pending, 1-accepted, 2-rejected
        allowNull: false,
      },
      is_seen: {
        type: Sequelize.TINYINT,
        defaultValue: 0, // 0-not seen, 1-seen
        allowNull: false,
      },
      date_modified: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0000-00-00 00:00:00',
      },
      date_added: {
        type: Sequelize.DATE, // Change from STRING to DATE
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }    
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Joinleagues');
  },
};
