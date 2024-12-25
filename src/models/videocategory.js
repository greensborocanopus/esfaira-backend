'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VideoCategory extends Model {
    static associate(models) {
      VideoCategory.hasMany(models.Video, {
        foreignKey: 'category_id',
        as: 'videos',
      });
    }
  }

  VideoCategory.init(
    {
      videocategory_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Add this line
      },
      category_name: { type: DataTypes.STRING(100), defaultValue: '' },
      image: { type: DataTypes.STRING(200), defaultValue: '' },
      no_of_videos: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'VideoCategory',
      tableName: 'VideoCategories',
      timestamps: true,
    }
  );

  return VideoCategory;
};
