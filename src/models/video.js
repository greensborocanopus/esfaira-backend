module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define(
    'Video',
    {
      video_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true, // Enable auto-increment for video_id
      },
      reg_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cover_photo: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
      },
      date_added: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW, // Use current date as default
      },
      preference: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Video',
      tableName: 'Videos',
      timestamps: true, // Add createdAt and updatedAt columns
    }
  );

  // Define associations
  Video.associate = (models) => {
    Video.belongsTo(models.VideoCategory, {
      foreignKey: 'category_id',
      as: 'category', // Alias for the associated category
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Association with VideoRatings
    Video.hasMany(models.VideoRating, {
      foreignKey: 'video_id',
      as: 'videoRatings', // Alias for video's ratings
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
        
  };

  
  return Video;
};
