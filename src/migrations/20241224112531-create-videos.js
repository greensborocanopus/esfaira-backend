'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Videos', {
      video_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true, // Add this line
      },
      reg_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Allow null as per your earlier request
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'VideoCategories',
          key: 'videocategory_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING(50),
        defaultValue: '',
      },
      description: {
        type: Sequelize.STRING(500),
        defaultValue: '',
      },
      path: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      cover_photo: {
        type: Sequelize.STRING(200),
        defaultValue: '',
      },
      total_time: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'in seconds',
      },
      date_added: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW, // Use `Sequelize.NOW` instead of '0000-00-00'
      },
      preference: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0,
        comment: '0-no,1-yes',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Videos');
  },
};
