const fs = require('fs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const jsonData = JSON.parse(fs.readFileSync('./data/states.json', 'utf8'));
      
      if (!jsonData || !jsonData.states) {
        throw new Error("Invalid JSON structure. 'states' key is missing.");
      }

      const states = jsonData.states.map(state => {
        // Log the current state being processed
        console.log(`Processing state: ${state.name}`);
        console.log(`State ID: ${state.state_id}, Name: ${state.name}, Country ID: ${state.country_id}`);

        // Basic validation checks
        if (!state.state_id || !state.name || !state.country_id) {
          throw new Error(`Missing required fields for state: ${state.name}`);
        }

        // Additional validation to ensure valid country_id and state_id
        if (typeof state.state_id !== 'string' || typeof state.country_id !== 'string') {
          throw new Error(`Invalid data types for state_id or country_id in state: ${state.name}`);
        }

        // Check for duplicate state_id (if necessary based on constraints)
        if (state.state_id.length < 1) {
          throw new Error(`Invalid state_id length for state: ${state.name}`);
        }

        return {
          state_id: state.state_id, 
          name: state.name, 
          country_id: state.country_id,
          updated_at: new Date(),
        };
      });

      // Log total number of states to insert
      console.log(`Total states to insert: ${states.length}`);

      // Insert the data into the database
      await queryInterface.bulkInsert('States', states);

      console.log('States data inserted successfully.');
    } catch (error) {
      console.error('Error during seeding process:', error.message);
      // Log the specific state data that caused the error for troubleshooting
      if (error.name === 'SequelizeValidationError') {
        console.error('Validation Error details:', error.errors);
      }
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('States', null, {});
      console.log('All states have been removed from the table.');
    } catch (error) {
      console.error('Error during rollback process:', error.message);
      throw error;
    }
  }
};
