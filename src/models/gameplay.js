'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gameplay extends Model {
    static associate(models) {
      Gameplay.belongsTo(models.Subleague, {
        foreignKey: 'sub_league_id',
        as: 'subleague',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }
  Gameplay.init(
    {
      game_play_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
      game_plays: { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' },
      kick_off_time_1: { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' },
      kick_off_time_2: { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' },
      sub_league_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Gameplay',
      tableName: 'Gameplays',
      timestamps: false,
    }
  );
  return Gameplay;
};
