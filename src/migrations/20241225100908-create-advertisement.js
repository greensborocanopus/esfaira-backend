'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Advertisements', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      reg_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      age_first: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      age_second: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      advertisment_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      audience_package: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      campaign_start: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      drp_country: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      drp_state: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      drp_city: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      uploadLogo: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      slide_picture1: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      slide_picture2: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      slide_picture3: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      slide_picture4: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      product_details: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      product_price: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      update_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Advertisements');
  },
};
