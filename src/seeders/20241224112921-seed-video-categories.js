'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('VideoCategories', [
      {
        videocategory_id: 1,
        category_name: 'Corner kick',
        image: 'uploads/categories/1.jpg',
        no_of_videos: 0,
        createdAt: new Date(), // Add timestamps
        updatedAt: new Date(),
      },
      {
        videocategory_id: 2,
        category_name: 'Freekick',
        image: 'uploads/categories/2.jpg',
        no_of_videos: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        videocategory_id: 3,
        category_name: 'Penalty kick',
        image: 'uploads/categories/3.jpg',
        no_of_videos: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        videocategory_id: 4,
        category_name: 'Chilena',
        image: 'uploads/categories/4.jpg',
        no_of_videos: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        videocategory_id: 5,
        category_name: 'Header defense',
        image: 'uploads/categories/5.jpg',
        no_of_videos: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        videocategory_id: 6,
        category_name: 'Header goal',
        image: 'uploads/categories/6.jpg',
        no_of_videos: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        videocategory_id: 7,
        category_name: 'Goalkeeper',
        image: 'uploads/categories/6.jpg',
        no_of_videos: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        videocategory_id: 8,
        category_name: 'Dribbling',
        image: 'uploads/categories/6.jpg',
        no_of_videos: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        videocategory_id: 9,
        category_name: 'Freestyle',
        image: 'uploads/categories/6.jpg',
        no_of_videos: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        videocategory_id: 10,
        category_name: 'Goal',
        image: 'uploads/categories/6.jpg',
        no_of_videos: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        videocategory_id: 11,
        category_name: 'Own skills',
        image: 'uploads/categories/6.jpg',
        no_of_videos: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('VideoCategories', null, {});
  },
};
