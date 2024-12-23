'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class League extends Model {
    static associate(models) {
      // Define associations here
      League.hasMany(models.Subleague, { foreignKey: 'league_id', as: 'subleagues' });
    }
  }
  League.init(
    {
      league_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
      league_name: { type: DataTypes.STRING(100), allowNull: false },
      reg_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'League',
      tableName: 'Leagues',
      timestamps: false,
    }
  );
  return League;
};
