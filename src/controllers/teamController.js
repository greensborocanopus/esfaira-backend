const { Team, TeamPlayer, User, Subleague, Joinleague, Notification, Gameplay, League } = require('../models');
const user = require('../models/user');
const { Op, where } = require('sequelize');

exports.createTeam = async (req, res) => {
  try {
    const { name, sub_league_id, players } = req.body;

    const { id } = req.user;

    const user = await User.findByPk(id);

    // Fetch the subleague name using the provided sub_league_id
    const subleague = await Subleague.findOne({
      where: { sub_league_id },
      attributes: ['sub_league_name', 'reg_id'],
    });

    console.log('subleague.reg_id', subleague.reg_id);
    
    if (!subleague) {
      return res.status(404).json({ message: 'Subleague not found' });
    }
    

    // Check if all provided player IDs exist
    if (players && players.length > 0) {
      const playerIds = players.map((player) => player.player_id);

      // Fetch existing players from the database
      const existingPlayers = await User.findAll({
        where: {
          id: playerIds,
        },
        attributes: ['id', 'name'],
      });

      const existingPlayerIds = existingPlayers.map((player) => player.id);

      // Find missing player IDs
      const missingPlayerIds = playerIds.filter((playerId) => !existingPlayerIds.includes(playerId));

      if (missingPlayerIds.length > 0) {
        return res.status(400).json({
          message: 'Some player IDs do not exist',
          missingPlayerIds,
        });
      }
    }

    // Create the team
    const team = await Team.create({
      user_id: req.user.id, // Get the user ID from the authenticated user
      name,
      sub_league_id,
      status: 'Pending',
    });

    // Create players associated with the team
    if (players && players.length > 0) {
      const teamPlayers = players.map((player) => ({
        team_id: team.id,
        player_id: player.player_id,
        first_name: player.first_name,
        last_name: player.last_name,
        dob: player.dob,
        jersey_no: player.jersey_no,
      }));
      await TeamPlayer.bulkCreate(teamPlayers);
    }

    // ✅ Create a notification entry in the Notifications table
    await Notification.create({
      description: user.name,  // Updated description
      desc_other: `Sent request to join league${subleague.sub_league_name}`,
      type: 'LeagueAdminToJoinLeague',
      notif_flag: 'Pending',
      datetime: new Date(),
      reg_id: subleague.reg_id, 
      sentby_reg_id: req.user.id, // ID of the logged-in user
      path: `/teams/${team.id}`,
      subleage_id: sub_league_id,
      team_id: team.id,
      is_seen: false,
      is_done: false
    });
    

    res.status(201).json({ message: 'Team created successfully', team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [
        {
          model: TeamPlayer,
          as: 'players',
        },
      ],
    });
    res.status(200).json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findOne({
      where: { id },
      include: [
        {
          model: TeamPlayer,
          as: 'players',
        },
      ],
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTeamsBySubleague = async (req, res) => {
  try {
      const userId = req.user.id; // Assuming you have user info available in req.user
      
      // Step 1: Fetch all subleagues where the reg_id matches the logged-in user's ID
      const subleagues = await Subleague.findAll({
          where: { reg_id: userId },
          attributes: ['sub_league_id', 'sub_league_name']
      });

      if (!subleagues.length) {
          return res.status(404).json({ message: 'No subleagues found for the logged-in user.' });
      }

      // Step 2: Extract subleague IDs
      const subleagueIds = subleagues.map(subleague => subleague.sub_league_id);

      // // Step 3: Check in the Notifications table where subleague_id matches and notif_flag is 'Approved'
      // const approvedNotifications = await Notification.findAll({
      //     where: {
      //         subleage_id: { [Op.in]: subleagueIds },
      //         notif_flag: 'Accepted'
      //     },
      //     attributes: ['subleage_id', 'team_id', 'notif_flag']
      // });

      // // Step 4: Extract approved subleague IDs
      // //const approvedSubleagueIds = approvedNotifications.map(notif => notif.subleage_id);
      // const approvedTeamIds = approvedNotifications.map(notif => notif.team_id);

      // if (!approvedTeamIds.length) {
      //     return res.status(404).json({ message: 'No approved subleagues found for the logged-in user.' });
      // }

      // Step 5: Fetch teams associated with the approved subleagues
      const teams = await Team.findAll({
          where: { sub_league_id: { [Op.in]: subleagueIds }, status: 'Accepted' },
          include: [
            {
                model: User,
                as: 'manager',
                attributes: ['name']
            },
              {
                  model: Subleague,
                  as: 'subleague',
                  //attributes: ['sub_league_name', 'league_id']
                  include: [
                      {
                        model: League,
                        as: 'league',
                        //attributes: ['league_id', 'league_name']
                      },
                      {
                        model: Gameplay,
                        as: 'gameplays',
                      }
                  ]
              },
              {
                model: Notification,
                as: 'notifications',
                where: { notif_flag: 'Accepted' },
                attributes: ['notif_id', 'notif_flag', 'sentby_reg_id'],
                required: false,
              //   include: [
              //     {
              //         model: User,
              //         as: 'sender', // Ensure this matches the alias defined in the model association
              //         attributes: ['name']  // Fetch the name of the user who sent the notification
              //     }
              // ]
            },
          ]
      });

      if (!teams.length) {
          return res.status(404).json({ message: 'No teams found for approved subleagues.' });
      }

      // Step 6: Send Response
      res.status(200).json({ teams });
  } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ message: 'Server error occurred.' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { team_id, action } = req.body;

    // Validate input
    if (!team_id || !action) {
      return res.status(400).json({ error: 'team_id and action are required.' });
    }

    // Normalize action to handle case-insensitivity
    const normalizedAction = action.trim().toLowerCase();

    if (normalizedAction !== 'accepted' && normalizedAction !== 'rejected') {
      return res.status(400).json({ error: 'Action must be Accepted or Rejected.' });
    }

    // Update the status in the database
    const [updatedCount] = await Team.update(
      { status: normalizedAction === 'accepted' ? 'Accepted' : 'Rejected' },
      { where: { id: team_id } }
    );

    const [notificationUpdatedCount] = await Notification.update(
      { notif_flag: normalizedAction === 'accepted' ? 'Accepted' : 'Rejected', is_seen: true, is_done: true },
      { where: { team_id: team_id } }
    );


    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Team not found or no updates made.' });
    }

    return res.status(200).json({ message: 'Status updated successfully.' });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getTeamsBySubleagueId = async (req, res) => {
  try {
      const { sub_league_id } = req.params; // Getting sub_league_id from URL parameters
      console.log(req.params);
      if (!sub_league_id) {
          return res.status(400).json({ message: 'Subleague ID is required.' });
      }

      // Step 1: Verify if the subleague exists
      const subleague = await Subleague.findOne({
          where: { sub_league_id },
          attributes: ['sub_league_id', 'sub_league_name', 'price_per_team']
      });

      if (!subleague) {
          return res.status(404).json({ message: 'Subleague not found.' });
      }

      // Step 2: Fetch all teams associated with the provided subleague ID
      const teams = await Team.findAll({
          where: { sub_league_id },
          include: [
            {
              model: User,
              as: 'manager',
              attributes: ['name']
            },
              {
                  model: Subleague,
                  as: 'subleague',
                  //attributes: ['sub_league_name', 'league_id','venue_details', 'season', 'price_per_team'],
                  include: [
                    {
                      model: League,
                      as: 'league',
                      //attributes: ['league_id', 'league_name']
                    },
                    {
                      model: Gameplay,
                      as: 'gameplays',
                    }
                  ]
              },
              {
                model: Notification,
                as: 'notifications',
                //where: { notif_flag: 'Accepted' },
                attributes: ['notif_id', 'notif_flag', 'sentby_reg_id'],
                required: false
            }
          ]
      });

      if (!teams.length) {
          return res.status(404).json({ message: 'No teams found for this subleague.' });
      }

      // Step 3: Send Response
      // Step 3: Calculate price_per_player for each team
    const teamsWithPricePerPlayer = await Promise.all(
      teams.map(async (team) => {
        // Fetch total players for the team
        const playerCount = await TeamPlayer.count({
          where: { team_id: team.id },
        });

        // Calculate price_per_player
        const pricePerPlayer =
          playerCount > 0 ? subleague.price_per_team / playerCount : 0;

        return {
          ...team.toJSON(), // Convert team instance to plain object
          price_per_player: pricePerPlayer,
        };
      })
    );

    // Step 4: Send Response
    res.status(200).json({
      message: 'Teams retrieved successfully',
      teams: teamsWithPricePerPlayer,
    });
  } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ message: 'Server error occurred.' });
  }
};

exports.requestToJoinTeam = async (req, res) => {
  try {
      const { team_id, sub_league_id } = req.body;

      const user = await User.findByPk(req.user.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      // Validate team existence
      const team = await Team.findByPk(team_id);
      if (!team) {
          return res.status(404).json({ message: 'Team not found.' });
      }

      // Validate subleague existence
      const subleague = await Subleague.findByPk(sub_league_id, {
          attributes: ['sub_league_name', 'reg_id']
      });
      if (!subleague) {
          return res.status(404).json({ message: 'Subleague not found.' });
      }

      // Check if a notification already exists for the same request
      const existingRequest = await Notification.findOne({
          where: {
              team_id,
              subleage_id: sub_league_id,
              reg_id: subleague.reg_id,
              sentby_reg_id: req.user.id,
              notif_flag: 'Pending'
          }
      });

      if (existingRequest) {
          return res.status(400).json({ message: 'A request to join this team already exists.' });
      }

      // Create a notification
      const notification = await Notification.create({
          description: user.name,
          desc_other: `Sent request to join team ${team.name} in ${subleague.sub_league_name}`,
          type: 'PlayerToTeamJoinRequest',
          notif_flag: 'Pending',
          datetime: new Date(),
          reg_id: team.user_id, // Team manager or league admin's ID
          sentby_reg_id: req.user.id, // Requesting user's ID
          path: `/teams/${team_id}`,
          subleage_id: sub_league_id,
          team_id: team_id,
          is_seen: false,
          is_done: false
      });

      res.status(201).json({
          message: 'Request to join team has been sent successfully.',
          notification
      });
  } catch (error) {
      console.error('Error creating request to join team:', error);
      res.status(500).json({ message: 'Server error', error });
  }
};

exports.getJoinedTeams = async (req, res) => {
  try {
    // Check if the user exists
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find all team players where the player ID matches the logged-in user and the status is 'accepted'
    const acceptedTeamPlayers = await TeamPlayer.findAll({
      where: {
        player_id: req.user.id,
        status: 'accepted', // Check for accepted status
      },
      //attributes: ['team_id'], // Only fetch team_id
    });

    // Extract team IDs from the result
    const teamIds = acceptedTeamPlayers.map((tp) => tp.team_id);

    // Fetch all teams with matching team IDs
    const teams = await Team.findAll({
      where: {
        id: teamIds, // Match against the extracted team IDs
      },
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['name']
        },
          {
              model: Subleague,
              as: 'subleague',
              //attributes: ['sub_league_name', 'league_id','venue_details', 'season', 'price_per_team'],
              include: [
                {
                  model: League,
                  as: 'league',
                  //attributes: ['league_id', 'league_name']
                },
                {
                  model: Gameplay,
                  as: 'gameplays',
                }
              ]
          },
          {
            model: Notification,
            as: 'notifications',
            //where: { notif_flag: 'Accepted' },
            attributes: ['notif_id', 'notif_flag', 'sentby_reg_id'],
            required: false
        }
      ]
    });

    const Player = await TeamPlayer.findOne({
      where: {
        Player_id: req.user.id
      },
      attributes: ['id', 'player_id', 'first_name', 'last_name', 'status'],
    })
    
    // Respond with the list of joined teams
    res.status(200).json({
      Player,
      teams,
    });
  } catch (error) {
    console.error('Error fetching joined teams:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.updatePlayerStatus = async (req, res) => {
  try {
    const { team_id, player_id, action } = req.body;

    // Validate input
    if (!team_id || !player_id || !action) {
      return res.status(400).json({ error: 'team_id, player_id, and status are required.' });
    }

    // Normalize action to handle case-insensitivity
    const normalizedAction = action.trim().toLowerCase();

    if (normalizedAction !== 'accepted' && normalizedAction !== 'rejected') {
      return res.status(400).json({ error: 'Action must be Accepted or Rejected.' });
    }
  
    // Update player status
    const [updatedCount] = await TeamPlayer.update(
      { status: normalizedAction == 'accepted' ? 'accepted' : 'rejected' }, 
      { where: { team_id, player_id } }
    );

    if (updatedCount > 0) {
      res.status(200).json({ message: 'Player status updated successfully.' });
    } else {
      res.status(404).json({ error: 'Player not found.' });
    }
  } catch (error) {
    console.error('Error updating player status:', error);
    res.status(500).json({ error: 'Server error' });  
  }
};




