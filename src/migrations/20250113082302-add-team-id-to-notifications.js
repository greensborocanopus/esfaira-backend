'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Notifications', 'team_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Teams',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Notifications', 'team_id');
    }
};
