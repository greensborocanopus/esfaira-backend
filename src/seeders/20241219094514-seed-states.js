'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('States', [
      { state_id: 1, name: 'Andhra Pradesh', country_id: 101, iso2: 'AP', status: 1 },
      { state_id: 2, name: 'Arunachal Pradesh', country_id: 101, iso2: 'AR', status: 1 },
      { state_id: 3, name: 'Assam', country_id: 101, iso2: 'AS', status: 1 },
      { state_id: 4, name: 'Bihar', country_id: 101, iso2: 'BR', status: 1 },
      { state_id: 5, name: 'Chhattisgarh', country_id: 101, iso2: 'CT', status: 1 },
      { state_id: 6, name: 'Goa', country_id: 101, iso2: 'GA', status: 1 },
      { state_id: 7, name: 'Gujarat', country_id: 101, iso2: 'GJ', status: 1 },
      { state_id: 8, name: 'Haryana', country_id: 101, iso2: 'HR', status: 1 },
      { state_id: 9, name: 'Himachal Pradesh', country_id: 101, iso2: 'HP', status: 1 },
      { state_id: 10, name: 'Jharkhand', country_id: 101, iso2: 'JH', status: 1 },
      { state_id: 11, name: 'Karnataka', country_id: 101, iso2: 'KA', status: 1 },
      { state_id: 12, name: 'Kerala', country_id: 101, iso2: 'KL', status: 1 },
      { state_id: 13, name: 'Madhya Pradesh', country_id: 101, iso2: 'MP', status: 1 },
      { state_id: 14, name: 'Maharashtra', country_id: 101, iso2: 'MH', status: 1 },
      { state_id: 15, name: 'Manipur', country_id: 101, iso2: 'MN', status: 1 },
      { state_id: 16, name: 'Meghalaya', country_id: 101, iso2: 'ML', status: 1 },
      { state_id: 17, name: 'Mizoram', country_id: 101, iso2: 'MZ', status: 1 },
      { state_id: 18, name: 'Nagaland', country_id: 101, iso2: 'NL', status: 1 },
      { state_id: 19, name: 'Odisha', country_id: 101, iso2: 'OR', status: 1 },
      { state_id: 20, name: 'Punjab', country_id: 101, iso2: 'PB', status: 1 },
      { state_id: 21, name: 'Rajasthan', country_id: 101, iso2: 'RJ', status: 1 },
      { state_id: 22, name: 'Sikkim', country_id: 101, iso2: 'SK', status: 1 },
      { state_id: 23, name: 'Tamil Nadu', country_id: 101, iso2: 'TN', status: 1 },
      { state_id: 24, name: 'Telangana', country_id: 101, iso2: 'TG', status: 1 },
      { state_id: 25, name: 'Tripura', country_id: 101, iso2: 'TR', status: 1 },
      { state_id: 26, name: 'Uttar Pradesh', country_id: 101, iso2: 'UP', status: 1 },
      { state_id: 27, name: 'Uttarakhand', country_id: 101, iso2: 'UK', status: 1 },
      { state_id: 28, name: 'West Bengal', country_id: 101, iso2: 'WB', status: 1 },
      { state_id: 29, name: 'Delhi', country_id: 101, iso2: 'DL', status: 1 },
      { state_id: 30, name: 'Jammu and Kashmir', country_id: 101, iso2: 'JK', status: 1 },
      { state_id: 31, name: 'Ladakh', country_id: 101, iso2: 'LA', status: 1 },
      { state_id: 32, name: 'Chandigarh', country_id: 101, iso2: 'CH', status: 1 },
      { state_id: 33, name: 'Puducherry', country_id: 101, iso2: 'PY', status: 1 },
      { state_id: 34, name: 'Andaman and Nicobar Islands', country_id: 101, iso2: 'AN', status: 1 },
      { state_id: 35, name: 'Lakshadweep', country_id: 101, iso2: 'LD', status: 1 },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('States', null, {});
  },
};
