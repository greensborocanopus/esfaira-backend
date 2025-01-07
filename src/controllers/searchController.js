const { Op, fn, col } = require('sequelize');
const { TeamPlayer, User, Team, Subleague, League, Joinleague } = require('../models');

const searchAPI = async (req, res) => {
    try {
        const { keyword } = req.query;
        const {
            country,
            player_position,
            age_small,
            age_big,
            gender,
            teams,
            leagues,
            join_leagues,
            continent,
        } = req.body;

        // Prepare filters
        let whereClause = {};

        // ✅ Country Filter
        if (country) {
            whereClause['$player.place$'] = { [Op.like]: `%${country}%` };
        }

        // ✅ Player Position Filter
        if (player_position && player_position.length > 0) {
            whereClause['$player.category_subcategory$'] = {
                [Op.or]: player_position.map(pos => ({ [Op.like]: `%${pos}%` }))
            };
        }

        // ✅ Gender Filter
        if (gender) {
            whereClause['$player.gender$'] = gender;
        }

        // ✅ Age Range Filter (Calculating date range from age_small to age_big)
        if (age_small && age_big) {
            const currentDate = new Date();
            const maxDate = new Date(currentDate.getFullYear() - age_small, 0, 1); // Jan 1st for younger limit
            const minDate = new Date(currentDate.getFullYear() - age_big, 11, 31); // Dec 31st for older limit
        
            // ✅ Checking dob in TeamPlayers table (not Users)
            whereClause['dob'] = {
                [Op.between]: [minDate, maxDate]
            };
        }        
        
        let results;

        // ✅ If Teams filter is applied
        if (teams) {
            results = await Team.findAll({
                where: {
                    ...whereClause,
                    name: { [Op.like]: `%${keyword}%` }
                },
                include: [{ model: TeamPlayer, as: 'players', include: [{ model: User, as: 'player' }] }]
            });
        }

        // ✅ If Leagues filter is applied, search in both Leagues and Subleagues
        else if (leagues) {
            results = await Subleague.findAll({
                where: {
                    [Op.or]: [
                        { sub_league_name: { [Op.like]: `%${keyword}%` } },
                        { '$league.league_name$': { [Op.like]: `%${keyword}%` } }
                    ]
                },
                include: [{ model: League, as: 'league', attributes: ['league_name'] }]
            });
        }

        // ✅ If Join Leagues filter is applied
        else if (join_leagues) {
            const joinedLeagues = await Joinleague.findAll({
                where: { requested_reg_id: req.user.id },
                attributes: ['sub_league_id']
            });
            const joinedSubLeagueIds = joinedLeagues.map(jl => jl.sub_league_id);

            results = await Subleague.findAll({
                where: {
                    sub_league_id: { [Op.notIn]: joinedSubLeagueIds },
                    [Op.or]: [
                        { sub_league_name: { [Op.like]: `%${keyword}%` } },
                        { '$league.league_name$': { [Op.like]: `%${keyword}%` } }
                    ]
                },
                include: [
                    {
                        model: League,
                        as: 'league',
                        attributes: ['league_name']
                    }
                ]
            });
        }

        // ✅ If No Exclusive Filter is Selected, Search Across All Tables
        else {
            results = await TeamPlayer.findAll({
                where: {
                    ...whereClause,
                    [Op.or]: [
                        { '$player.name$': { [Op.like]: `%${keyword}%` } },
                        { '$team.name$': { [Op.like]: `%${keyword}%` } },
                        { '$team.subleague.sub_league_name$': { [Op.like]: `%${keyword}%` } },
                        { '$team.subleague.league.league_name$': { [Op.like]: `%${keyword}%` } }
                    ],
                },
                include: [
                    {
                        model: User,
                        as: 'player',
                        attributes: ['id', 'name', 'category_subcategory', 'place']
                    },
                    {
                        model: Team,
                        as: 'team',
                        attributes: ['id', 'name'],
                        include: [
                            {
                                model: Subleague,
                                as: 'subleague',
                                attributes: ['sub_league_name'],
                                include: [{ model: League, as: 'league', attributes: ['league_name'] }]
                            }
                        ]
                    }
                ]
            });
        }

        res.status(200).json({ results });
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { searchAPI };
