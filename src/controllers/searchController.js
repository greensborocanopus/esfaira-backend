const { Op, fn, col, where } = require('sequelize');
const { TeamPlayer, User, Team, Subleague, League, Joinleague, Gameplay } = require('../models');
const { sequelize } = require('../models');

const globalSearch = async (req, res) => {
    try {
        const { keyword } = req.query;

        console.log('keyword:'. keyword);
        if(keyword.length == 0){
           return res.status(400).json({ message: "Keyword is required" });
        }
        
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
            const currentYear = new Date().getFullYear();
            const minYear = currentYear - age_big;
            const maxYear = currentYear - age_small;
        
            // Use Sequelize.literal for raw SQL expressions
            whereClause = {
                [Op.and]: [
                    sequelize.literal(`CAST(SUBSTRING_INDEX(TeamPlayer.dob, ' ', -1) AS UNSIGNED) BETWEEN ${minYear} AND ${maxYear}`)
                ]
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
                        { league_unique_id: { [Op.like]: `%${keyword}%` } },
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
            // Fetch joinLeagueResults
            const teamPlayerTeamIds = await TeamPlayer.findAll({
                where: {
                player_id: req.user.id,
                status: 'accepted', // Check for accepted status
                },
                attributes: ['team_id'],
            });
            // Extract team IDs
            const teamIds = teamPlayerTeamIds.map((tp) => tp.team_id);
            // Fetch subleague IDs from the Teams table
            const teamsWithSubLeagues = await Team.findAll({
                where: {
                    id: teamIds, // Match team IDs from TeamPlayer
                    status: 'accepted', // Check for accepted status in Teams
                },
                attributes: ['sub_league_id'], // Fetch sub_league_id
                });
            // Extract sub_league_ids
            const excludedSubLeagueIds = teamsWithSubLeagues.map((tp) => tp.sub_league_id);
            
            // Fetch subleagues the user is eligible to join
            const results = await Subleague.findAll({
                where: {
                sub_league_id: { [Op.notIn]: excludedSubLeagueIds }, // Exclude already joined subleagues
                [Op.or]: [
                    { sub_league_name: { [Op.like]: `%${keyword}%` } },
                    { sub_league_id: keyword },
                    { league_unique_id: { [Op.like]: `%${keyword}%` } },
                    { '$league.league_name$': { [Op.like]: `%${keyword}%` } },
                    { '$league.league_id$': keyword }// Match keyword in league name
                ],
                },
                include: [
                {
                    model: League,
                    as: 'league',
                    attributes: ['league_name'], // Include league name
                },
                ],
                });
            
            // Return the results
            return res.status(200).json({
            message: 'Eligible subleagues retrieved successfully.',
            subleagues: results,
            });
        }          

        // ✅ If No Exclusive Filter is Selected, Search Across All Tables
        else {
            const teamPlayers = await TeamPlayer.findAll({
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
                        attributes: ['id', 'name', 'category_subcategory', 'place', 'unique_id']
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
                                        model: Gameplay,                
                                        as: 'gameplays',                
                                        attributes: { exclude: [] } // ✅ Fetch all fields of Gameplay
                                    },
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
            
            const userResults = await User.findAll({
                where: {
                    [Op.or]: [
                        { unique_id: { [Op.like]: `%${keyword}%` } },
                        { name: { [Op.like]: `%${keyword}%` } },
                        { category_subcategory: { [Op.like]: `%${keyword}%` } },
                        { place: { [Op.like]: `%${keyword}%` } }
                    ]
                },
                //attributes: ['id', 'name', 'category_subcategory', 'place']
            });

            const teamResults = await Team.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${keyword}%` } },
                        { id: keyword },
                        { user_id: keyword },
                        { sub_league_id: keyword }, 
                        { status: { [Op.like]: `%${keyword}%` } },
                        { '$subleague.sub_league_name$': { [Op.like]: `%${keyword}%` } },
                        { '$subleague.league.league_name$': { [Op.like]: `%${keyword}%` } }
                    ]
                },
                include: [
                    {
                        model: Subleague,
                        as: 'subleague',
                        attributes: { exclude: [] }, // Fetch all columns of Subleague
                        include: [
                            {
                                model: Gameplay,
                                as: 'gameplays',
                                attributes: { exclude: [] } // Fetch all columns of Gameplays
                            },
                            {
                                model: League,
                                as: 'league',
                                attributes: { exclude: [] } // Fetch all columns of League
                            }
                        ]
                    }
                ]
            });

            const subLeagueResults = await Subleague.findAll({
                where: {
                  [Op.or]: [
                    { sub_league_name: { [Op.like]: `%${keyword}%` } },
                    { sub_league_id: keyword },
                    { league_unique_id: { [Op.like]: `%${keyword}%` } },
                    { '$league.league_name$': { [Op.like]: `%${keyword}%` } },
                  ],
                },
                include: [
                  {
                    model: League,
                    as: 'league',
                    attributes: { exclude: [] },
                  },
                  {
                    model: Gameplay,
                    as: 'gameplays',
                    attributes: { exclude: [] },
                  },
                ],
            });
            
            // Fetch joinLeagueResults
            const teamPlayerTeamIds = await TeamPlayer.findAll({
                where: {
                  player_id: req.user.id,
                  status: 'accepted', // Check for accepted status
                },
                attributes: ['team_id'],
              });

            // Extract team IDs
            const teamIds = teamPlayerTeamIds.map((tp) => tp.team_id);

            // Fetch subleague IDs from the Teams table
            const teamsWithSubLeagues = await Team.findAll({
            where: {
                id: teamIds, // Match team IDs from TeamPlayer
                status: 'accepted', // Check for accepted status in Teams
            },
            attributes: ['sub_league_id'], // Fetch sub_league_id
            });

            // Extract sub_league_ids
            const excludedSubLeagueIds = teamsWithSubLeagues.map((tp) => tp.sub_league_id);
            
            // Fetch subleagues the user is eligible to join
            const joinLeagueResults = await Subleague.findAll({
                where: {
                  sub_league_id: { [Op.notIn]: excludedSubLeagueIds }, // Exclude already joined subleagues
                  [Op.or]: [
                      { sub_league_name: { [Op.like]: `%${keyword}%` } },
                      { sub_league_id: keyword },
                      { league_unique_id: { [Op.like]: `%${keyword}%` } },
                      { '$league.league_name$': { [Op.like]: `%${keyword}%` } },
                      { '$league.league_id$': keyword }// Match keyword in league name
                  ],
                },
                include: [
                  {
                    model: League,
                    as: 'league',
                    attributes: ['league_name'], // Include league name
                  },
                ],
            });

            return res.status(200).json({ 
                teamPlayers,
                userResults,
                teamResults,
                subLeagueResults,
                joinLeagueResults
            });
        }



        res.status(200).json({ results });
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { globalSearch };
