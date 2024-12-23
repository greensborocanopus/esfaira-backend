'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const leaguesData = [
      { league_id: 1, league_name: 'STGO', reg_id: 342 },
      { league_id: 2, league_name: 'MP', reg_id: 342 },
      { league_id: 3, league_name: 'gs+po1', reg_id: 342 },
      { league_id: 4, league_name: 'BA', reg_id: 342 },
      { league_id: 5, league_name: 'bt50', reg_id: 342 },
      { league_id: 6, league_name: 'santiago', reg_id: 342 },
      { league_id: 7, league_name: 'leg', reg_id: 359 },
    ];

    await queryInterface.bulkInsert('Leagues', leaguesData);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Leagues', null, {});
  },
};
