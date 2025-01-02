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

module.exports = { searchOrganization };