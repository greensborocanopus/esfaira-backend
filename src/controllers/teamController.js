const { Team, TeamPlayer, User } = require('../models');

exports.createTeam = async (req, res) => {
  try {
    const { name, sub_league_id, players } = req.body;

    // Check if all provided player IDs exist
    if (players && players.length > 0) {
      const playerIds = players.map((player) => player.player_id);

      // Fetch existing players from the database
      const existingPlayers = await User.findAll({
        where: {
          id: playerIds,
        },
        attributes: ['id'],
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
