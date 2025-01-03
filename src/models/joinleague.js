'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Joinleague extends Model {
    static associate(models) {
      // Define foreign key associations
      Joinleague.belongsTo(models.Subleague, {
        foreignKey: 'sub_league_id',
        as: 'subleague',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Joinleague.belongsTo(models.Team, {
        foreignKey: 'team_id',
        as: 'team',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Joinleague.belongsTo(models.League, {
        foreignKey: 'league_admin_reg_id',
        as: 'leagueAdmin',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Joinleague.belongsTo(models.User, {
        foreignKey: 'requested_reg_id',
        as: 'requestedUser',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Joinleague.init(
    {
      join_league_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sub_league_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      league_admin_reg_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      requested_reg_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0, // 0-pending, 1-accepted, 2-rejected
      },
      is_seen: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0, // 0-not seen, 1-seen
      },
      date_modified: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '0000-00-00 00:00:00',
      },
      date_added: {
        type: DataTypes.DATE, // Change from STRING to DATE
        allowNull: false,
        defaultValue: DataTypes.NOW
    },    
    },
    {
      sequelize,
      modelName: 'Joinleague',
      tableName: 'Joinleagues',
      timestamps: false,
    }
  );

  return Joinleague;
};
