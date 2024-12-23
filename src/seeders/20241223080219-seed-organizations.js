'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Organizations', [
      { org_id: 1, organization_name: 'CHILE', reg_id: 342 },
      { org_id: 2, organization_name: 'INDIA', reg_id: 342 },
      { org_id: 3, organization_name: 'GS+PO', reg_id: 342 },
      { org_id: 4, organization_name: 'ARG', reg_id: 342 },
      { org_id: 5, organization_name: 'org', reg_id: 359 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Organizations', null, {});
  },
};
