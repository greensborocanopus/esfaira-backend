const fs = require('fs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Read and parse the JSON file
    const jsonData = JSON.parse(fs.readFileSync('./data/states.json', 'utf8'));
    const states = jsonData.states.map(state => ({
      state_id: state.state_id, // Use the 'id' field as-is since it is already a string
      name: state.name,
      country_id: state.country_id, // Use the 'country_id' as-is
      updated_at: new Date(), // Add a timestamp for the updated_at field
    }));

    // Insert the data into the database
    await queryInterface.bulkInsert('States', states);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all entries from the 'States' table
    await queryInterface.bulkDelete('States', null, {});
  }
};
