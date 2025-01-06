const { Op } = require('sequelize');
const { TeamPlayer, User, Team, Subleague, League, Joinleague } = require('../models');

const searchAPI = async (req, res) => {
    try {
        const { keyword } = req.query;
        const { country, player_position, leagues } = req.body;

        // Prepare filters
        let whereClause = {};
        if (country) {
            whereClause['$player.place$'] = { [Op.like]: `%${country}%` };
        }
        if (player_position && player_position.length > 0) {
            whereClause['$player.category_subcategory$'] = {
                [Op.or]: player_position.map(pos => ({ [Op.like]: `%${pos}%` }))
            };
        }

        let results;

        // ✅ If Leagues filter is applied, search in both Leagues and Subleagues
        if (leagues) {
            results = await Subleague.findAll({
                where: {
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
        } else {
            // ✅ Default: Search in all tables if no exclusive filter is selected
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
