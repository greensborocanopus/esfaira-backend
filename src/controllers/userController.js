const { allowedCategories } = require('../constants'); // Import allowed categories
const bcrypt = require('bcryptjs');
const { User } = require('../models'); // Import User model
const { Country, State, City } = require('../models'); // Import models


const updateUser = async (req, res) => {
    const userId = req.params.id; // Get the user ID from the URL
    const updatedFields = req.body; // Get fields to update from the request body

    try {
        // If category_subcategory is being updated, validate it
        if (updatedFields.category_subcategory) {
            let categories = [];

            // Handle both string and array input formats
            if (typeof updatedFields.category_subcategory === 'string') {
                categories = updatedFields.category_subcategory.split(',').map(c => c.trim());
            } else if (Array.isArray(updatedFields.category_subcategory)) {
                categories = updatedFields.category_subcategory.map(c => c.trim());
            } else {
                return res.status(400).json({
                    message: 'Validation error.',
                    errors: {
                        category_subcategory: 'Category/subcategory must be a string or an array.',
                    },
                });
            }

            // Validate categories
            const invalidCategories = categories.filter(category => !allowedCategories.includes(category));

            if (invalidCategories.length > 0) {
                return res.status(400).json({
                    message: 'Validation error.',
                    errors: {
                        category_subcategory: `Invalid categories: ${invalidCategories.join(', ')}. Allowed values are ${allowedCategories.join(', ')}.`,
                    },
                });
            }

            // If valid, reformat category_subcategory as a comma-separated string
            updatedFields.category_subcategory = categories.join(', ');
        }

        // Find the user by ID
        const user = await User.findByPk(userId);

        // If user not found, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update the user with new fields
        await user.update(updatedFields);

        // Respond with the updated user
        res.status(200).json({
            message: 'User updated successfully.',
            user,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

const addCountry = async (req, res) => {
    const { shortname, name, phonecode } = req.body;
  
    if (!shortname || !name || !phonecode) {
      return res.status(400).json({ message: 'shortname, name, and phonecode are required.' });
    }
  
    try {
      const country = await Country.create({ shortname, name, phonecode });
      res.status(201).json({ message: 'Country added successfully.', country });
    } catch (error) {
      console.error('Error adding country:', error);
      res.status(500).json({ message: 'Server error.', error });
    }
  };
  
const addState = async (req, res) => {
    const { state_id, name, country_id, iso2 } = req.body;
  
    if (!state_id || !name || !country_id) {
      return res.status(400).json({ message: 'state_id, name, and country_id are required.' });
    }
  
    try {
      const countryExists = await Country.findByPk(country_id);
      if (!countryExists) {
        return res.status(404).json({ message: 'Country not found.' });
      }
  
      const state = await State.create({ state_id, name, country_id, iso2 });
      res.status(201).json({ message: 'State added successfully.', state });
    } catch (error) {
      console.error('Error adding state:', error);
      res.status(500).json({ message: 'Server error.', error });
    }
};
  
const addCity = async (req, res) => {
    const { city_id, name, state_id, country_id, latitude, longitude } = req.body;
  
    if (!city_id || !name || !state_id || !country_id || !latitude || !longitude) {
      return res.status(400).json({
        message: 'city_id, name, state_id, country_id, latitude, and longitude are required.',
      });
    }
  
    try {
      const countryExists = await Country.findByPk(country_id);
      if (!countryExists) {
        return res.status(404).json({ message: 'Country not found.' });
      }
  
      const stateExists = await State.findByPk(state_id);
      if (!stateExists) {
        return res.status(404).json({ message: 'State not found.' });
      }
  
      const city = await City.create({
        city_id,
        name,
        state_id,
        country_id,
        latitude,
        longitude,
      });
      res.status(201).json({ message: 'City added successfully.', city });
    } catch (error) {
      console.error('Error adding city:', error);
      res.status(500).json({ message: 'Server error.', error });
    }
};
  
module.exports = { updateUser, addCountry, addState, addCity };

