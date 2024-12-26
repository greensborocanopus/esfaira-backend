'use strict';

module.exports = (sequelize, DataTypes) => {
  const VideoRating = sequelize.define('VideoRating', {
    auto_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    video_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Videos',
        key: 'video_id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    is_liked: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return VideoRating;
};
