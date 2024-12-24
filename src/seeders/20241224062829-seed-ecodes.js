'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Ecodes', [
      { ecode: 'ABCDE12345678', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'FGHIJ1234567', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'KLMNO1234567', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'PQRST1234567', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'UVWXY1234567', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'ABCDE2345678', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'FGHIJ2345678', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'KLMNO2345678', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'PQRST2345678', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'UVWXY2345678', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'ABCDE3456789', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'FGHIJ3456789', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'KLMNO3456789', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'PQRST3456789', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'UVWXY3456789', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'ABCDE4567890', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'FGHIJ4567890', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'KLMNO4567890', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'PQRST4567890', createdAt: new Date(), updatedAt: new Date() },
      { ecode: 'UVWXY4567890', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ecodes', null, {});
  },
};
