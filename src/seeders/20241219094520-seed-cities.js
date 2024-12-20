const fs = require('fs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const jsonData = JSON.parse(fs.readFileSync('./data/cities.json', 'utf8'));

    // Initialize arrays for valid cities and invalid cities
    const validCities = [];
    const invalidCities = [];

    // Validate and map cities
    for (const city of jsonData.cities) {
      if (!city.id || !city.name || !city.state_id) {
        console.log("Invalid city entry:", city);
        invalidCities.push(city);
        continue;
      }

      const stateExists = await queryInterface.rawSelect(
        'States',
        {
          where: { state_id: city.state_id },
        },
        ['state_id']
      );

      if (stateExists) {
        validCities.push({
          city_id: city.id,
          name: city.name,
          state_id: city.state_id,
          updated_at: new Date(),
        });
      } else {
        console.log(`Invalid state_id: ${city.state_id} for city: ${city.name}`);
        invalidCities.push(city);
      }
    }

    // Log summary of validation
    console.log(`Total cities processed: ${jsonData.cities.length}`);
    console.log(`Valid cities: ${validCities.length}`);
    console.log(`Invalid cities: ${invalidCities.length}`);

    // Insert valid cities into the database
    if (validCities.length > 0) {
      await queryInterface.bulkInsert('Cities', validCities);
      console.log(`Inserted ${validCities.length} cities successfully.`);
    } else {
      console.log('No valid cities to insert.');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Cities', null, {});
  },
};
