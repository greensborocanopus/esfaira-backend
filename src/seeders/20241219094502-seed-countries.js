'use strict';
const fs = require('fs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Read and parse the JSON file
    const jsonData = JSON.parse(fs.readFileSync('./data/countries.json', 'utf8'));

    // Fetch valid currency codes from the Currencies table
    const validCurrencies = await queryInterface.sequelize.query(
      'SELECT code FROM Currencies;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const validCurrencyCodes = validCurrencies.map((currency) => currency.code);

    // Filter and validate countries
    const countries = jsonData.countries.filter((country) => {
      if (!country.currency || validCurrencyCodes.includes(country.currency)) {
        return true; // Valid country
      } else {
        console.warn(`Skipping country with invalid currency: ${country.name} (${country.currency})`);
        return false; // Skip invalid country
      }
    }).map((country) => ({
      id: country.id.toString(),
      shortname: country.shortname,
      name: country.name,
      phonecode: country.phoneCode.toString(),
      currency: validCurrencyCodes.includes(country.currency) ? country.currency : null,
    }));

    if (countries.length === 0) {
      console.error('No valid countries to insert. Please check the input data.');
      return;
    }

    // Insert validated data
    try {
      await queryInterface.bulkInsert('Countries', countries);
      console.log(`${countries.length} countries inserted successfully.`);
    } catch (error) {
      console.error('Error inserting countries:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all entries from the 'Countries' table
    await queryInterface.bulkDelete('Countries', null, {});
  },
};
