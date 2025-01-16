'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      // Define all associations inside a single associate block
      Team.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'manager',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

      Team.belongsTo(models.Subleague, {
        foreignKey: 'sub_league_id',
        as: 'subleague',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

      Team.hasMany(models.TeamPlayer, {
        foreignKey: 'team_id',
        as: 'players',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

      // models/Team.js
      Team.hasMany(models.Notification, {
        foreignKey: 'team_id',
        as: 'notifications',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

    
    }
  }

  Team.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sub_league_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: '',
      },
      status: { 
        type: DataTypes.STRING, 
        allowNull: true 
      }, // Add the status field
    },
    {
      sequelize,
      modelName: 'Team',
      tableName: 'Teams',
      timestamps: true,  // Timestamps set to true since migration includes them
     
    }
  );

  return Team;
};
