'use strict';
const fs = require('fs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Read and parse the JSON file
    const jsonData = JSON.parse(fs.readFileSync('./data/countries.json', 'utf8'));

    // Map the JSON data to match the table schema
    const countries = jsonData.countries.map(country => ({
      id: country.id.toString(), // Convert id to string if not already
      shortname: country.shortname, // JSON key must match DB column
      name: country.name,
      phonecode: country.phoneCode.toString(), // Convert phoneCode to string if not already
    }));    

    console.log('Data being inserted:', countries);

    // Insert the data into the database
    await queryInterface.bulkInsert('Countries', countries);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all entries from the 'Countries' table
    await queryInterface.bulkDelete('Countries', null, {});
  },
};
