'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // Existing associations
            User.hasMany(models.VideoRating, {
                foreignKey: 'user_id',
                as: 'videoRatings',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

            // ✅ New association with Notification as receiver
            User.hasMany(models.Notification, {
                foreignKey: 'reg_id',
                as: 'receivedNotifications',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

            // ✅ New association with Notification as sender
            User.hasMany(models.Notification, {
                foreignKey: 'sentby_reg_id',
                as: 'sentNotifications',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }

    User.init(
        {
            unique_id: { type: DataTypes.STRING, allowNull: false, unique: true },
            gender: { type: DataTypes.STRING, allowNull: false },
            category_subcategory: { type: DataTypes.STRING, allowNull: false },
            place: { type: DataTypes.STRING, allowNull: false },
            dob: { type: DataTypes.STRING, allowNull: false },
            name: { type: DataTypes.STRING, allowNull: false },
            jersey_no: { type: DataTypes.INTEGER, allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            password: { type: DataTypes.STRING, allowNull: false },
            reset_token: { type: DataTypes.STRING, allowNull: true },
            reset_token_expiry: { type: DataTypes.DATE, allowNull: true },
            photo: { type: DataTypes.STRING(255), allowNull: true }
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'Users',
            timestamps: false
        }
    );

    return User;
};
