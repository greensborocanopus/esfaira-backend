const { TeamPlayer, User, Joinleague, League, Subleague, Organization, Gameplay, Team } = require('../models'); // Import the League model
const { Op } = require('sequelize');

// API to add a league
// const addLeague = async (req, res) => {
//   const {
//     organization,
//     league,
//     sports_complex,
//     venue,
//     season,
//     website,
//     category,
//     game_format,
//     minimum_players_per_team,
//     league_price_per_team,
//     match_duration,
//     type_of_league,
//     number_of_fields_available,
//     number_of_teams_competing,
//     bank_name,
//     beneficiary_bank_account_number,
//     company_name,
//     email,
//     // Payment fields (commented out for now)
//     // method_of_payment,
//     // name_on_card,
//     // expiry_date,
//     // cvv,
//     // card_number,
//   } = req.body;

//   // Validation for required fields
//   if (!organization || !league || !league_name || !sports_complex || !venue || !season || !category || !league_price_per_team || !type_of_league) {
//     return res.status(400).json({ message: 'Required fields are missing.' });
//   }

//   try {
//     // Add the league to the database
//     const newLeague = await League.create({
//       organization,
//       league,
//       league_name,
//       sports_complex,
//       venue,
//       season,
//       website,
//       category,
//       game_format,
//       minimum_players_per_team,
//       league_price_per_team,
//       match_duration,
//       type_of_league,
//       number_of_fields_available,
//       number_of_teams_competing,
//       bank_name,
//       beneficiary_bank_account_number,
//       company_name,
//       email,
//     });

//     return res.status(201).json({ message: 'League added successfully.', league: newLeague });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error.', error });
//   }
// };

const addLeague = async (req, res) => {
  const { league_name } = req.body;
  const reg_id = req.user.id; // Assuming user is authenticated and available in req.user

  // Validate the required fields
  if (!league_name) {
    return res.status(400).json({ message: 'League name is required.' });
  }

  try {
    // Create the league in the database
    const newLeague = await League.create({
      league_name,
      reg_id,
    });

    res.status(201).json({
      message: 'League added successfully!',
      league: newLeague,
    });
  } catch (error) {
    console.error('Error adding league:', error);
    res.status(500).json({ message: 'An error occurred while adding the league.' });
  }
};

const updateLeague = async (req, res) => {
  const leagueId = req.params.id; // Get the league ID from the URL
  const updatedFields = req.body; // Get fields to update from the request body

  try {
    // Find the league by ID
    const league = await League.findByPk(leagueId);

    // If league not found, return an error
    if (!league) {
      return res.status(404).json({ message: 'League not found.' });
    }

    // Update the league with new fields
    await league.update(updatedFields);

    // Respond with the updated league
    res.status(200).json({
      message: 'League updated successfully.',
      league,
    });
  } catch (error) {
    console.error('Error updating league:', error);
    res.status(500).json({ message: 'Server error.', error });
  }
};

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
      attributes: ['sub_league_name', 'venue_details', 'category', 'sub_league_id'], // Fetch specific Subleague fields
    });

    // Transform the data into the desired format
    const response = subleagues.map((subleague) => ({
      sub_league_id: subleague.sub_league_id || '',
      org: subleague.organization?.organization_name || 'Unknown Organization', // Use associated organization_name
      league: subleague.league?.league_name || 'Unknown League', // Use associated league_name
      complex: {
        name: subleague.sub_league_name || 'Unknown Venue',
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

const getLeagues = async (req, res) => {
  try {
    let searchTerm = req.query.searchTerm;
    // Fetch subleagues with associated leagues
    const subleagues = await League.findAll({
      where: {
        league_name: {
          [Op.like]: `%${searchTerm}%`, // Replace searchTerm with the actual search term
        },
      },
    });
    // Transform the data into the desired format
    res.status(200).json(subleagues);
  } catch (error) {
    console.error('Error fetching subleagues:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getSubleagueById = async (req, res) => {
  try {
    const subleagueId = req.params.id;
    console.log({ subleagueId });

    // Fetch the subleague by ID along with related Gameplay data
    const subleague = await Subleague.findOne({
      where: { sub_league_id: subleagueId },
      include: [
        {
          model: Gameplay, // Assuming Gameplay is associated with Subleague
          as: 'gameplays', // Use the alias defined in your model association
        },
      ],
    });

    // Check if the subleague exists
    if (!subleague) {
      return res.status(404).json({ message: 'Subleague not found' });
    }

    const kickOffTimes = subleague.gameplays.map((gameplay) => `${gameplay.kick_off_time_1} - ${gameplay.kick_off_time_2}`).join(', ');

    const subleagueWithKickOffTime = {
      ...subleague.toJSON(), // Convert Sequelize instance to plain object
      kick_off_time: kickOffTimes,
    };

    // Return the fetched subleague along with gameplays
    res.status(200).json(subleagueWithKickOffTime);
  } catch (error) {
    console.error('Error fetching subleague:', error);
    res.status(500).json({ message: 'Error fetching subleague', error });
  }
};

const addSubleague = async (req, res) => {
  try {
    const reg_id = req.user?.id; // Ensure you have authentication middleware configured

    if (!reg_id) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    let { organization, league, gameplayRows, sub_league_id, org_id, league_id, league_picture, sub_league_name, venue_details, venue_city, venue_state, venue_country, venue_continent, venue_zipcode, venue_lat, venue_long, season, website, category, gender, game_format, match_duration, minplayers_perteam, type_of_league_1, type_of_league_2, no_of_field_available, no_of_field_competing, quantity_of_groups, status, first_name, last_name, email, phone, currency, old_team, new_team, bank_name, country, address, price_per_team, bank_acc_no, company_name, date_added, gold_finalmatches, silver_finalmatches, bronze_finalmatches, tie_twoteams, tie_moreteams, yellowcards, missedmatch, miss_nxtmatch, group_allocated, fixture_allocated, league_unique_id, league_expired_date } = req.body;

    if (organization) {
      let existingOrganization = await Organization.findOne({ where: { organization_name: organization } });
      if (existingOrganization) {
        org_id = existingOrganization.org_id;
      } else {
        existingOrganization = await Organization.create({
          organization_name: organization,
          reg_id: reg_id,
        });
        org_id = existingOrganization.org_id;
      }
    }
    if (league) {
      let existingLeague = await League.findOne({ where: { League_name: league } });
      if (existingLeague) {
        league_id = existingLeague.league_id;
      } else {
        existingLeague = await League.create({
          league_name: league,
          reg_id: reg_id, // Example default value
        });
        league_id = existingLeague.league_id;
      }
    }
    // Validation for required fields
    if (!league_id || !sub_league_name || !season || price_per_team == null) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Create subleague in the database
    const newSubleague = await Subleague.create({
      sub_league_id,
      org_id,
      league_id,
      league_picture,
      sub_league_name,
      reg_id,
      venue_details,
      venue_city,
      venue_state,
      venue_country,
      venue_continent,
      venue_zipcode,
      venue_lat,
      venue_long,
      season,
      website,
      category,
      gender,
      game_format,
      match_duration,
      minplayers_perteam,
      type_of_league_1,
      type_of_league_2,
      no_of_field_available,
      no_of_field_competing,
      quantity_of_groups,
      status,
      first_name,
      last_name,
      email,
      phone,
      currency,
      old_team,
      new_team,
      bank_name,
      country,
      address,
      price_per_team,
      bank_acc_no,
      company_name,
      date_added,
      gold_finalmatches,
      silver_finalmatches,
      bronze_finalmatches,
      tie_twoteams,
      tie_moreteams,
      yellowcards,
      missedmatch,
      miss_nxtmatch,
      group_allocated,
      fixture_allocated,
      league_unique_id,
      league_expired_date,
    });

    // Store the Gameplay data
    for (const row of gameplayRows) {
      await Gameplay.create({
        sub_league_id: newSubleague.sub_league_id, // Use the generated sub_league_id
        game_plays: row.gameplayDays,
        kick_off_time_1: row.kickoffStartTime,
        kick_off_time_2: row.kickoffEndTime,
      });
    }

    return res.status(201).json({
      message: 'Subleague added successfully.',
      subleague: newSubleague,
    });
  } catch (error) {
    console.error('Error adding subleague:', error);
    res.status(500).json({ message: 'Server error.', error });
  }
};

const joinLeague = async (req, res) => {
  try {
    const { sub_league_id, team_id } = req.body;
    const requested_reg_id = req.user.id; // Assuming the user is authenticated and id is available in the token

    // Validate required fields
    if (!sub_league_id || !team_id) {
      return res.status(400).json({ message: 'Sub League ID and Team ID are required.' });
    }

    // Validate subleague and team existence
    const subleague = await Subleague.findByPk(sub_league_id);
    if (!subleague) {
      return res.status(404).json({ message: 'Subleague not found.' });
    }

    const team = await Team.findByPk(team_id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found.' });
    }

    // Validate league admin exists in the Subleague
    const leagueAdmin = await League.findOne({
      where: { reg_id: subleague.reg_id },
    });
    if (!leagueAdmin) {
      return res.status(404).json({ message: 'League admin not found.' });
    }

    // Check if the team has already requested to join this league
    const existingRequest = await Joinleague.findOne({
      where: { sub_league_id, team_id, requested_reg_id },
    });
    if (existingRequest) {
      return res.status(400).json({ message: 'Team has already requested to join this league.' });
    }

    // Create the join request
    const newJoinRequest = await Joinleague.create({
      sub_league_id,
      team_id,
      league_admin_reg_id: subleague.reg_id,
      requested_reg_id,
      status: 0, // Default: Pending
      is_seen: 0,
      date_added: new Date(),
    });

    return res.status(201).json({ message: 'Join league request submitted successfully.', data: newJoinRequest });
  } catch (error) {
    console.error('Error while submitting join league request:', error);
    return res.status(500).json({ message: 'Server error.', error });
  }
};

const getJoinLeague = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is stored in the request after authentication

    // Fetch all joined leagues for the logged-in user
    const joinedLeagues = await Joinleague.findAll({
      where: { requested_reg_id: userId },
      include: [
        {
          model: Subleague,
          as: 'subleague',
          attributes: ['sub_league_id', 'league_id', 'sub_league_name'],
          include: [
            {
              model: League,
              as: 'league',
              attributes: ['league_id', 'league_name'],
            },
          ],
        },
      ],
    });

    if (!joinedLeagues.length) {
      return res.status(404).json({ message: 'No leagues found for this user' });
    }

    // Prepare response data
    const response = joinedLeagues.map((join) => ({
      join_league_id: join.join_league_id,
      sub_league_id: join.sub_league_id,
      sub_league_name: join.subleague.sub_league_name,
      league_id: join.subleague.league.league_id,
      league_name: join.subleague.league.league_name,
    }));

    return res.status(200).json({ leagues: response });
  } catch (error) {
    console.error('Error fetching joined leagues:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const searchPlayer = async (req, res) => {
  try {
    const { unique_id, sub_league_id } = req.body;

    // Step 1: Fetch User ID using unique_id
    const user = await User.findOne({ where: { unique_id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 2: Fetch all teams that have joined the subleague
    const teamsInSubleague = await Team.findAll({
      where: { sub_league_id },
      attributes: ['id'], // Fetch only team IDs
    });

    const teamIds = teamsInSubleague.map((team) => team.id);

    // Step 3: Check if the user is already in any of those teams
    const alreadyJoined = await TeamPlayer.findOne({
      where: {
        player_id: user.id,
        team_id: teamIds, // Checking if the user is part of any of these teams
      },
    });

    // Step 4: Return Response
    if (alreadyJoined) {
      return res.status(400).json({
        message: `The user has already joined this subleague with another team.`,
      });
    }

    return res.status(200).json({ status: 'OK', message: 'User can join this subleague' });
  } catch (error) {
    console.error('Error checking subleague participation:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { searchPlayer, getJoinLeague, getSubleagues, addLeague, updateLeague, getSubleagueById, addSubleague, getLeagues, joinLeague };

