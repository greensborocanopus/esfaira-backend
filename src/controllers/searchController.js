const { Op, fn, col } = require('sequelize');
const { TeamPlayer, User, Team, Subleague, League, Joinleague, Gameplay } = require('../models');
const gameplay = require('../models/gameplay');

const globalSearch = async (req, res) => {
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
            unique_id,
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
        
        if (unique_id) {
            whereClause['$player.unique_id'] = unique_id;
        }

        let results;

        // ✅ If Teams filter is applied
        if (teams) {
            results = await Team.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${keyword}%` } },  // Search in team name
                        { id: keyword }  // Exact match for team ID
                    ]
                },
                include: [
                    {
                        model: Subleague,
                        as: 'subleague',
                        attributes: ['sub_league_id', 'sub_league_name'],
                        include: [
                            {
                                model: League,
                                as: 'league',
                                attributes: ['league_id', 'league_name']
                            }
                        ]
                    }
                ]
            });
        }
               

        // ✅ If Leagues filter is applied, search in both Leagues and Subleagues
        else if (leagues) {
            // Fetch subleagues matching the keyword and their associated leagues
            const subleagueResults = await Subleague.findAll({
                where: {
                    [Op.or]: [
                        { sub_league_name: { [Op.like]: `%${keyword}%` } },
                        { sub_league_id: keyword },
                        { '$league.league_name$': { [Op.like]: `%${keyword}%` } },
                        { '$league.league_id$': keyword }
                    ]
                },
                include: [
                    {
                        model: League,
                        as: 'league',
                        attributes: { exclude: [] } // Fetch all columns of League
                    },
                    {
                        model: Gameplay,
                        as: 'gameplays',
                        attributes: { exclude: [] } // Fetch all columns of Gameplays
                    }
                ]
            });
        
            // ✅ Search Directly in the Leagues Table
            const leagueResults = await League.findAll({
                where: {
                    [Op.or]: [
                        { league_name: { [Op.like]: `%${keyword}%` } },
                        { league_id: keyword }
                    ]
                },
                include: [
                    {
                        model: Subleague,
                        as: 'subleagues',
                        attributes: { exclude: [] }, // Fetch all columns of Subleague
                        include: [
                            {
                                model: Gameplay,
                                as: 'gameplays',
                                attributes: { exclude: [] }
                            }
                        ]
                    }
                ]
            });
        
            // ✅ Format response as requested
            const formattedResponse = {
                subleagues: subleagueResults.map(subleague => ({
                    ...subleague.get(),
                    league: subleague.league ? [subleague.league.get()] : [],
                    gameplays: subleague.gameplays ? subleague.gameplays.map(gameplay => gameplay.get()) : []
                })),
                leagues: leagueResults.map(league => ({
                    ...league.get(),
                    subleagues: league.subleagues ? league.subleagues.map(subleague => ({
                        ...subleague.get(),
                        gameplays: subleague.gameplays ? subleague.gameplays.map(gameplay => gameplay.get()) : []
                    })) : [], // ✅ Added check for undefined subleagues
                }))
            };
            
        
            results = formattedResponse;
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
                        { '$player.unique_id$': { [Op.like]: `%${keyword}%` } },
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
                                attributes: { exclude: [] }, // ✅ Fetch all fields of Subleague
                                include: [
                                    {
                                        model: League,
                                        as: 'league',
                                        attributes: { exclude: [] } // ✅ Fetch all fields of League
                                    }
                                ]                            
                            }
                        ]
                    }
                ]
            });

            // ✅ Format the response into a more structured format
            // const formattedResponse = {
            //     players: results.map(result => ({
            //         ...result.player.get(), // Flattening player object
            //         team: result.team ? {
            //             ...result.team.get(), // Flattening team object
            //             subleague: result.team.subleague ? {
            //                 ...result.team.subleague.get(), // Flattening subleague object
            //                 league: result.team.subleague.league ? result.team.subleague.league.get() : null
            //             } : null
            //         } : null
            //     })),
            //     teams: results.map(result => ({
            //         ...result.team.get(),
            //         subleague: result.team.subleague ? {
            //             ...result.team.subleague.get(),
            //             league: result.team.subleague.league ? result.team.subleague.league.get() : null
            //         } : null
            //     })),
            //     subleagues: results.map(result => result.team?.subleague?.get()).filter(Boolean),
            //     leagues: results.map(result => result.team?.subleague?.league?.get()).filter(Boolean)
            // };

            // results = formattedResponse;
        }



        res.status(200).json({ results });
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { globalSearch };
