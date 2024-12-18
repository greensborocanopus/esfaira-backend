const { allowedCategories } = require('../constants'); // Import allowed categories
const bcrypt = require('bcryptjs');
const { User } = require('../models'); // Import User model

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

module.exports = { updateUser };