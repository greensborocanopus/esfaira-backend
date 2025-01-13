'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            // Define association with the User model (assuming reg_id refers to a user)
            Notification.belongsTo(models.User, {
                foreignKey: 'reg_id',
                as: 'receiver'
            });

            // Define association with the User model for sentby_reg_id
            Notification.belongsTo(models.User, {
                foreignKey: 'sentby_reg_id',
                as: 'sender'
            });

            // Define association with Subleague model
            Notification.belongsTo(models.Subleague, {
                foreignKey: 'subleage_id',
                as: 'subleague'
            });

            Notification.belongsTo(models.Team, {
                foreignKey: 'team_id',
                as: 'team'
            });
        }
    }

    Notification.init(
        {
            notif_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ''
            },
            desc_other: DataTypes.STRING,
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ''
            },
            notif_flag: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'Pending'
            },
            datetime: {
                type: DataTypes.DATE,
                allowNull: false
            },
            reg_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            sentby_reg_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            path: {
                type: DataTypes.TEXT
            },
            subleage_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            team_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            is_seen: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            is_done: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: 'Notification',
            tableName: 'Notifications',
            timestamps: false
        }
    );

    return Notification;
};
