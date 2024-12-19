'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Cities', [
      { city_id: 1, name: 'Mumbai', state_id: 14, country_id: 101, latitude: '19.0760', longitude: '72.8777', status: 1 },
      { city_id: 2, name: 'Delhi', state_id: 29, country_id: 101, latitude: '28.7041', longitude: '77.1025', status: 1 },
      { city_id: 3, name: 'Bangalore', state_id: 11, country_id: 101, latitude: '12.9716', longitude: '77.5946', status: 1 },
      { city_id: 4, name: 'Hyderabad', state_id: 24, country_id: 101, latitude: '17.3850', longitude: '78.4867', status: 1 },
      { city_id: 5, name: 'Ahmedabad', state_id: 7, country_id: 101, latitude: '23.0225', longitude: '72.5714', status: 1 },
      { city_id: 6, name: 'Chennai', state_id: 23, country_id: 101, latitude: '13.0827', longitude: '80.2707', status: 1 },
      { city_id: 7, name: 'Kolkata', state_id: 28, country_id: 101, latitude: '22.5726', longitude: '88.3639', status: 1 },
      { city_id: 8, name: 'Pune', state_id: 14, country_id: 101, latitude: '18.5204', longitude: '73.8567', status: 1 },
      { city_id: 9, name: 'Jaipur', state_id: 21, country_id: 101, latitude: '26.9124', longitude: '75.7873', status: 1 },
      { city_id: 10, name: 'Surat', state_id: 7, country_id: 101, latitude: '21.1702', longitude: '72.8311', status: 1 },
      { city_id: 11, name: 'Lucknow', state_id: 26, country_id: 101, latitude: '26.8467', longitude: '80.9462', status: 1 },
      { city_id: 12, name: 'Kanpur', state_id: 26, country_id: 101, latitude: '26.4499', longitude: '80.3319', status: 1 },
      { city_id: 13, name: 'Nagpur', state_id: 14, country_id: 101, latitude: '21.1458', longitude: '79.0882', status: 1 },
      { city_id: 14, name: 'Indore', state_id: 13, country_id: 101, latitude: '22.7196', longitude: '75.8577', status: 1 },
      { city_id: 15, name: 'Bhopal', state_id: 13, country_id: 101, latitude: '23.2599', longitude: '77.4126', status: 1 },
      { city_id: 16, name: 'Patna', state_id: 4, country_id: 101, latitude: '25.5941', longitude: '85.1376', status: 1 },
      { city_id: 17, name: 'Vadodara', state_id: 7, country_id: 101, latitude: '22.3072', longitude: '73.1812', status: 1 },
      { city_id: 18, name: 'Guwahati', state_id: 3, country_id: 101, latitude: '26.1445', longitude: '91.7362', status: 1 },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Cities', null, {});
  },
};
