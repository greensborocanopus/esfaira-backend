const { allowedCategories } = require('../constants'); // Import allowed categories
const bcrypt = require('bcryptjs');
const { User, Country, State, City } = require('../models'); // Import models
const jwt = require('jsonwebtoken');
const ffmpeg = require('fluent-ffmpeg'); // For processing video
const { Video, VideoCategory } = require('../models');
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/upload'); // Adjust the path as per your project structure

const getUser = async (req, res) => {
    try {
        // Extract the token from the authorization header
        const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
        if (!token) {
            return res.status(401).json({ message: 'Token missing or invalid.' });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret

        // Fetch the user using the ID from the token payload
        const user = await User.findByPk(decoded.id); // `decoded.id` was included in the token
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);

        // Handle token verification errors explicitly
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token.' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired.' });
        }

        res.status(500).json({ message: 'Server error.', error });
    }
};

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
    const { state_id, name, country_id } = req.body;
  
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
  
    if (!city_id || !name || !state_id) {
      return res.status(400).json({
        message: 'city_id, name and state_id are required',
      });
    }
  
    try {
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

const getCountries = async (req, res) => {
    try {
        const countries = await Country.findAll({
            attributes: ['id', 'shortname', 'name', 'phonecode'], // Select only required fields
        });
        res.status(200).json(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

const getStates = async (req, res) => {
    const { country_id } = req.query; // Optional query parameter to filter by country
    try {
        const whereClause = country_id ? { where: { country_id } } : {};
        const states = await State.findAll({
            ...whereClause,
            attributes: ['state_id', 'name', 'country_id'], // Select only required fields
        });
        res.status(200).json(states);
    } catch (error) {
        console.error('Error fetching states:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

const getCities = async (req, res) => {
    const { state_id, country_id } = req.query; // Optional query parameters to filter
    try {
        const whereClause = {};
        if (state_id) whereClause.state_id = state_id;
        if (country_id) whereClause.country_id = country_id;

        const cities = await City.findAll({
            where: whereClause,
            attributes: ['city_id', 'name', 'state_id'], // Select only required fields
        });
        res.status(200).json(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

const getCountryById = async (req, res) => {
    const { countryId } = req.query;

    if (!countryId) {
        return res.status(400).json({ message: 'countryId is required.' });
    }

    try {
        const country = await Country.findByPk(countryId, {
            attributes: ['id', 'shortname', 'name', 'phonecode'],
        });

        if (!country) {
            return res.status(404).json({ message: 'Country not found.' });
        }

        res.status(200).json(country);
    } catch (error) {
        console.error('Error fetching country:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

// Fetch a single state by ID
const getStateById = async (req, res) => {
    const { stateId } = req.query;

    if (!stateId) {
        return res.status(400).json({ message: 'stateId is required.' });
    }

    try {
        const state = await State.findByPk(stateId, {
            attributes: ['state_id', 'name', 'country_id'],
        });

        if (!state) {
            return res.status(404).json({ message: 'State not found.' });
        }

        res.status(200).json(state);
    } catch (error) {
        console.error('Error fetching state:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

// Fetch a single city by ID
const getCityById = async (req, res) => {
    const { cityId } = req.query;

    if (!cityId) {
        return res.status(400).json({ message: 'cityId is required.' });
    }

    try {
        const city = await City.findByPk(cityId, {
            attributes: ['city_id', 'name', 'state_id'],
        });

        if (!city) {
            return res.status(404).json({ message: 'City not found.' });
        }

        res.status(200).json(city);
    } catch (error) {
        console.error('Error fetching city:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

const getStateByCountry = async (req, res) => {
    const { countryId } = req.params;

    if (!countryId) {
        return res.status(400).json({ message: 'countryId is required.' });
    }

    try {
        const states = await State.findAll({
            where: { country_id: countryId },
            attributes: ['state_id', 'name', 'country_id'],
        });

        if (states.length === 0) {
            return res.status(404).json({ message: 'No states found for the given country.' });
        }

        res.status(200).json(states);
    } catch (error) {
        console.error('Error fetching states:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

const getCityByState = async (req, res) => {
    const { stateId } = req.params;

    if (!stateId) {
        return res.status(400).json({ message: 'stateId is required.' });
    }

    try {
        const cities = await City.findAll({
            where: { state_id: stateId },
            attributes: ['city_id', 'name', 'state_id'],
        });

        if (cities.length === 0) {
            return res.status(404).json({ message: 'No cities found for the given state.' });
        }

        res.status(200).json(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

const addVideo = async (req, res) => {
    try {
        const { category_id, title, description } = req.body;
        const videoFile = req.file;
        console.log('category_id, title, description', category_id, title, description);

        if (!videoFile) {
            return res.status(400).json({ message: 'No video file uploaded.' });
        }

        const tempVideoPath = videoFile.path;
        const finalVideoDir = path.join(__dirname, '../../uploads/videos');
        const finalVideoPath = path.join(finalVideoDir, videoFile.filename);

        // Ensure the final directory exists
        if (!fs.existsSync(finalVideoDir)) {
            fs.mkdirSync(finalVideoDir, { recursive: true });
        }

        // Check video duration
        ffmpeg.ffprobe(tempVideoPath, async (err, metadata) => {
            if (err) {
                console.error('Error reading video metadata:', err);
                return res.status(500).json({ message: 'Error reading video metadata.' });
            }

            const duration = Math.floor(metadata.format.duration); // Duration in seconds
            if (duration > 32) {
                fs.unlinkSync(tempVideoPath); // Delete the temporary file
                return res.status(400).json({ message: 'Video exceeds the 32-second limit.' });
            }

            // Move video to the final location
            fs.renameSync(tempVideoPath, finalVideoPath);

            // Save video information in the database
            const newVideo = await Video.create({
                category_id,
                title,
                description,
                path: `/uploads/videos/${videoFile.filename}`,
                total_time: duration,
            });

            // Update the number of videos in the category
            const category = await VideoCategory.findOne({ where: { videocategory_id: category_id } });
            if (category) {
                await category.update({ no_of_videos: category.no_of_videos + 1 });
            } else {
                console.error('Category not found for the provided category_id');
            }

            res.status(201).json({ message: 'Video uploaded successfully.', video: newVideo });
        });
    } catch (error) {
        console.error('Error adding video:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Check if the ID is valid
        if (!categoryId) {
            return res.status(400).json({ message: 'Category ID is required.' });
        }

        const category = await VideoCategory.findOne({
            where: { videocategory_id: categoryId },
            include: [
                {
                    model: Video,
                    as: 'videos',
                    attributes: ['video_id', 'title', 'description', 'path', 'total_time', 'cover_photo'],
                },
            ],
            attributes: ['videocategory_id', 'category_name', 'image', 'no_of_videos'],
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

const getAllCategories = async (req, res) => {
    try {
        // Fetch all categories
        const categories = await VideoCategory.findAll({
            attributes: ['videocategory_id', 'category_name', 'image', 'no_of_videos'], // Fetch only required fields
        });

        // Return response
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

const addCategory = async (req, res) => {
    try {
      upload.single('image')(req, res, async (err) => {
        if (err) {
          console.error('File upload error:', err);
          return res.status(400).json({ message: 'File upload failed.', error: err });
        }
  
        const { category_name } = req.body;
  
        // Validate required fields
        if (!category_name) {
          return res.status(400).json({ message: 'Category name is required.' });
        }
  
        // Ensure image is uploaded
        if (!req.file) {
          return res.status(400).json({ message: 'Category image is required.' });
        }
  
        // Move the uploaded file to the correct directory
        const finalDir = path.join(__dirname, '../../uploads/categories');
        if (!fs.existsSync(finalDir)) {
          fs.mkdirSync(finalDir, { recursive: true });
        }
        const finalPath = path.join(finalDir, req.file.filename);
        fs.renameSync(req.file.path, finalPath);
  
        // Save the new category to the database
        const newCategory = await VideoCategory.create({
          category_name,
          image: `/uploads/categories/${req.file.filename}`,
          no_of_videos: 0, // Default value
        });
  
        res.status(201).json({ message: 'Category added successfully.', category: newCategory });
      });
    } catch (error) {
      console.error('Error adding category:', error);
      res.status(500).json({ message: 'Server error.', error });
    }
};
  
module.exports = { getUser, updateUser, addCountry, addState, addCity, getCountries, getStates, getCities, getCountryById, getStateById, getCityById, getStateByCountry, getCityByState, addVideo, getCategoryById, getAllCategories, addCategory };

