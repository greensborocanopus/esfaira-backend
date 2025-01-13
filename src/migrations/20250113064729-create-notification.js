'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Notifications', {
            notif_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: ''
            },
            desc_other: Sequelize.STRING,
            type: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: ''
            },
            notif_flag: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'Pending'
            },
            datetime: {
                type: Sequelize.DATE,
                allowNull: false
            },
            reg_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            sentby_reg_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            path: {
                type: Sequelize.TEXT
            },
            subleage_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Subleagues',
                    key: 'sub_league_id'
                }
            },
            is_seen: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            is_done: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Notifications');
    }
};
