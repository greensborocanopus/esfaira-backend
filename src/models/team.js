'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      // Define association with the User model (team manager)
      Team.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'manager', // Alias for the team manager
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

      // Define association with the Subleague model
      Team.belongsTo(models.Subleague, {
        foreignKey: 'sub_league_id',
        as: 'subleague', // Alias for the subleague
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

      // Define association with the TeamPlayer model
      Team.hasMany(models.TeamPlayer, {
        foreignKey: 'team_id',
        as: 'players', // Alias for the players in this team
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  Team.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      sub_league_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false, defaultValue: '' }
    },
    {
      sequelize,
      modelName: 'Team',
      tableName: 'Teams',
      timestamps: false,
    }
  );

  return Team;
};