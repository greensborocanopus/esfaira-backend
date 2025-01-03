'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TeamPlayer extends Model {
    static associate(models) {
      // Define association with the Team model
      TeamPlayer.belongsTo(models.Team, {
        foreignKey: 'team_id',
        as: 'team',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Define association with the User model (player)
      TeamPlayer.belongsTo(models.User, {
        foreignKey: 'player_id',
        as: 'player',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  TeamPlayer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      player_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      jersey_no: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_invitation_sent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      player_confirm_status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment_status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_team_manager: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      player_confirm_playing: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'TeamPlayer',
      tableName: 'TeamPlayers',
      timestamps: true, // Set true to match the migration
    }
  );

  return TeamPlayer;
};
