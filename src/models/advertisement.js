'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Advertisement extends Model {
    static associate(models) {
      // Define associations if required
    }
  }
  Advertisement.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      reg_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      age_first: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      age_second: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      advertisment_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      audience_package: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      campaign_start: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      drp_country: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      drp_state: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      drp_city: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      uploadLogo: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      slide_picture1: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      slide_picture2: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      slide_picture3: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      slide_picture4: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      product_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      product_price: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      update_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Advertisement',
      tableName: 'Advertisements',
      timestamps: false, // Disable Sequelize's automatic timestamps
    }
  );
  return Advertisement;
};
