const { League, Subleague, Organization, Gameplay } = require('../models'); // Import the League model

// API to add a league
// const addLeague = async (req, res) => {
//     const {
//         organization,
//         league,
//         sports_complex,
//         venue,
//         season,
//         website,
//         category,
//         game_format,
//         minimum_players_per_team,
//         league_price_per_team,
//         match_duration,
//         type_of_league,
//         number_of_fields_available,
//         number_of_teams_competing,
//         bank_name,
//         beneficiary_bank_account_number,
//         company_name,
//         email,
//         // Payment fields (commented out for now)
//         // method_of_payment,
//         // name_on_card,
//         // expiry_date,
//         // cvv,
//         // card_number,
//     } = req.body;

//     // Validation for required fields
//     if (!organization || !league || !sports_complex || !venue || !season || !category || !league_price_per_team || !type_of_league) {
//         return res.status(400).json({ message: 'Required fields are missing.' });
//     }

//     try {
//         // Add the league to the database
//         const newLeague = await League.create({
//             organization,
//             league,
//             sports_complex,
//             venue,
//             season,
//             website,
//             category,
//             game_format,
//             minimum_players_per_team,
//             league_price_per_team,
//             match_duration,
//             type_of_league,
//             number_of_fields_available,
//             number_of_teams_competing,
//             bank_name,
//             beneficiary_bank_account_number,
//             company_name,
//             email,
//         });

//         return res.status(201).json({ message: 'League added successfully.', league: newLeague });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error.', error });
//     }
// };

// const updateLeague = async (req, res) => {
//     const leagueId = req.params.id; // Get the league ID from the URL
//     const updatedFields = req.body; // Get fields to update from the request body

//     try {
//         // Find the league by ID
//         const league = await League.findByPk(leagueId);

//         // If league not found, return an error
//         if (!league) {
//             return res.status(404).json({ message: 'League not found.' });
//         }

//         // Update the league with new fields
//         await league.update(updatedFields);

//         // Respond with the updated league
//         res.status(200).json({
//             message: 'League updated successfully.',
//             league,
//         });
//     } catch (error) {
//         console.error('Error updating league:', error);
//         res.status(500).json({ message: 'Server error.', error });
//     }
// };

const getSubleagues = async (req, res) => {
    try {
      // Fetch subleagues with associated leagues
      const subleagues = await Subleague.findAll({
        include: [
          {
            model: League,
            as: 'league', // Specify the alias used in the association
            attributes: ['league_name'], // Fetch only the league_name attribute
          },
          {
            model: Organization,
            as: 'organization', // Assuming an alias for Organization model
            attributes: ['organization_name'], // Fetch only the organization_name attribute
          },
          {
            model: Gameplay,
            as: 'gameplays', // Specify the alias used in the association
            attributes: ['game_plays'], // Fetch only the game_plays attribute
          },
        ],
        attributes: ['sub_league_name', 'venue_details', 'category'], // Fetch specific Subleague fields
      });
  
      // Transform the data into the desired format
      const response = subleagues.map((subleague) => ({
        org: subleague.organization?.organization_name || 'Unknown Organization', // Use associated organization_name
        league: subleague.league?.league_name || 'Unknown League', // Use associated league_name
        complex: {
          name: subleague.venue_details || 'Unknown Venue',
          gameplay: {
            dayes: subleague.gameplays?.map((gameplay) => gameplay.game_plays).join(', ') || '', // Include game_plays
            category: subleague.category || 'Unknown Category', // Use Subleague category
          },
        },
      }));
  
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching subleagues:', error);
      res.status(500).json({ message: 'Server error.' });
    }
};  
  

module.exports = { getSubleagues };
