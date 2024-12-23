'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    static associate(models) {
      // Define associations here
      Organization.hasMany(models.Subleague, { foreignKey: 'org_id', as: 'subleagues' });
    }
  }

  Organization.init(
    {
      org_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
      organization_name: { type: DataTypes.STRING(100), allowNull: false, defaultValue: '' },
      reg_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'Organization',
      tableName: 'Organizations',
      timestamps: false,
    }
  );

  return Organization;
};
