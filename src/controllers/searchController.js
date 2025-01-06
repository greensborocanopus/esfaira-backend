const { Op } = require('sequelize');
const { TeamPlayer, Team, Subleague, League, User } = require('../models');

const searchAPI = async (req, res) => {
    try {
        const { keyword } = req.query;
        const { country, player_position } = req.body;

        // Prepare filters
        let whereClause = {};
        if (country) {
            whereClause['$player.place$'] = {
                [Op.like]: `%${country}%`,
            };
        }
        if (player_position && player_position.length > 0) {
            whereClause['$player.category_subcategory$'] = {
                [Op.or]: player_position.map(pos => ({
                    [Op.like]: `%${pos}%`,
                })),
            };
        }

        // Main search query using associations
        const results = await TeamPlayer.findAll({
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
                    attributes: ['id', 'name', 'category_subcategory', 'place'],
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
                            include: [
                                {
                                    model: League,
                                    as: 'league',
                                    attributes: ['league_name']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        res.status(200).json({ results });
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { searchAPI };
