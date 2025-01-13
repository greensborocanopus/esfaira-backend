'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Subleague extends Model {
        static associate(models) {
            // Existing associations
            Subleague.belongsTo(models.League, {
                foreignKey: 'league_id',
                as: 'league',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });

            Subleague.belongsTo(models.Organization, {
                foreignKey: 'org_id',
                as: 'organization',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });

            Subleague.hasMany(models.Gameplay, {
                foreignKey: 'sub_league_id',
                as: 'gameplays',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });

            Subleague.hasMany(models.Team, {
                foreignKey: 'sub_league_id',
                as: 'teams',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });

            // ✅ New association with Notification model
            Subleague.hasMany(models.Notification, {
                foreignKey: 'subleage_id',
                as: 'notifications',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });
        }
    }

    Subleague.init(
        {
            sub_league_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
            org_id: { type: DataTypes.INTEGER, allowNull: false },
            league_id: { type: DataTypes.INTEGER, allowNull: false },
            league_picture: { type: DataTypes.STRING(500), allowNull: false },
            sub_league_name: { type: DataTypes.STRING(100), allowNull: false, defaultValue: '' },
            reg_id: { type: DataTypes.INTEGER, allowNull: false },
            venue_details: { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
            venue_city: { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
            venue_state: { type: DataTypes.STRING(500), allowNull: true, defaultValue: '' },
            venue_country: { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
            venue_continent: { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
            venue_zipcode: { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
            venue_lat: { type: DataTypes.STRING(255), allowNull: false },
            venue_long: { type: DataTypes.STRING(255), allowNull: false },
            season: { type: DataTypes.DATE, allowNull: false },
            website: { type: DataTypes.STRING(100), allowNull: true, defaultValue: '' },
            category: { type: DataTypes.STRING(100), allowNull: false, defaultValue: '' },
            gender: { type: DataTypes.STRING(255), allowNull: false },
            game_format: { type: DataTypes.STRING(100), allowNull: false, defaultValue: '' },
            match_duration: { type: DataTypes.STRING(100), allowNull: false },
            minplayers_perteam: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
            type_of_league_1: { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' },
            type_of_league_2: { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' },
            no_of_field_available: { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' },
            no_of_field_competing: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
            quantity_of_groups: { type: DataTypes.STRING(5), allowNull: false, defaultValue: '' },
            status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: '' },
            first_name: { type: DataTypes.STRING(100), allowNull: true, defaultValue: '' },
            last_name: { type: DataTypes.STRING(100), allowNull: true, defaultValue: '' },
            email: { type: DataTypes.STRING(100), allowNull: true, defaultValue: '' },
            phone: { type: DataTypes.STRING(20), allowNull: true, defaultValue: '' },
            currency: { type: DataTypes.STRING(20), allowNull: true, defaultValue: '' },
            old_team: { type: DataTypes.STRING(100), allowNull: true, defaultValue: '' },
            new_team: { type: DataTypes.STRING(100), allowNull: true, defaultValue: '' },
            bank_name: { type: DataTypes.STRING(225), allowNull: true, defaultValue: '' },
            country: { type: DataTypes.STRING(100), allowNull: true, defaultValue: '' },
            address: { type: DataTypes.TEXT, allowNull: true },
            price_per_team: { type: DataTypes.DOUBLE(15, 2), allowNull: true, defaultValue: 0.0 },
            bank_acc_no: { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' },
            company_name: { type: DataTypes.STRING(50), allowNull: true, defaultValue: '' },
            date_added: { type: DataTypes.DATE, allowNull: true },
            league_unique_id: { type: DataTypes.STRING(255), allowNull: false },
            league_expired_date: { type: DataTypes.DATE, allowNull: true }
        },
        {
            sequelize,
            modelName: 'Subleague',
            tableName: 'Subleagues',
            timestamps: false
        }
    );

    return Subleague;
};
