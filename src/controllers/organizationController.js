const { Organization } = require('../models');
const { Op } = require('sequelize');

const searchOrganization = async (req, res) => {
    try {
      let searchTerm = req.query.searchTerm
      // Fetch subleagues with associated leagues
      const organization = await Organization.findAll({
        where: {
            organization_name: {
            [Op.like]: `%${searchTerm}%`, // Replace searchTerm with the actual search term
          },
        },
      });
      // Transform the data into the desired format
      res.status(200).json(organization);
    } catch (error) {
      console.error('Error fetching subleagues:', error);
      res.status(500).json({ message: 'Server error.' });
    }
};

const addOrganization = async (req, res) => {
  const { organization_name } = req.body;
  const reg_id = req.user.id; // Assuming authenticated user is available in `req.user`

  // Validate input
  if (!organization_name) {
    return res.status(400).json({ message: 'Organization name is required.' });
  }

  try {
    // Create the organization
    const newOrganization = await Organization.create({
      organization_name,
      reg_id,
    });

    return res.status(201).json({
      message: 'Organization added successfully!',
      organization: newOrganization,
    });
  } catch (error) {
    console.error('Error adding organization:', error);
    res.status(500).json({ message: 'An error occurred while adding the organization.' });
  }
};

module.exports = { searchOrganization, addOrganization };