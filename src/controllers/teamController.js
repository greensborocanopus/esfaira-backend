const { Team, TeamPlayer } = require('../models');

exports.createTeam = async (req, res) => {
    try {
      const { name, sub_league_id, players } = req.body;
  
      // Create the team
      const team = await Team.create({
        user_id: req.user.id, // Get the user ID from the authenticated user
        name,
        sub_league_id,
      });
  
      // Create players associated with the team
      if (players && players.length > 0) {
        const teamPlayers = players.map(player => ({
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
            include: [{
                model: TeamPlayer,
                as: 'players',
            }],
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
        include: [{
          model: TeamPlayer,
          as: 'players',
        }],
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