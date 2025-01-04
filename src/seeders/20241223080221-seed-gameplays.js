'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Gameplays', [
      { game_play_id: 1, game_plays: 'SA', kick_off_time_1: '07:00', kick_off_time_2: '08:00', sub_league_id: 1 },
      { game_play_id: 2, game_plays: 'SA', kick_off_time_1: '08:00', kick_off_time_2: '09:00', sub_league_id: 2 },
      { game_play_id: 3, game_plays: 'TU', kick_off_time_1: '10:00', kick_off_time_2: '11:30', sub_league_id: 1 },
    //   { game_play_id: 4, game_plays: 'SU', kick_off_time_1: '11:00', kick_off_time_2: '12:00', sub_league_id: 4 },
    //   { game_play_id: 5, game_plays: 'SU', kick_off_time_1: '11:00', kick_off_time_2: '12:00', sub_league_id: 5 },
    //   { game_play_id: 6, game_plays: 'SA', kick_off_time_1: '12:00', kick_off_time_2: '13:00', sub_league_id: 6 },
    //   { game_play_id: 7, game_plays: 'TU', kick_off_time_1: '07:00', kick_off_time_2: '13:00', sub_league_id: 7 },
    //   { game_play_id: 8, game_plays: 'TU', kick_off_time_1: '07:00', kick_off_time_2: '08:30', sub_league_id: 8 },
    //   { game_play_id: 9, game_plays: 'MO', kick_off_time_1: '07:00', kick_off_time_2: '08:00', sub_league_id: 9 },
    //   { game_play_id: 10, game_plays: 'MO', kick_off_time_1: '07:00', kick_off_time_2: '09:00', sub_league_id: 10 },
    //   { game_play_id: 11, game_plays: 'TU', kick_off_time_1: '07:00', kick_off_time_2: '08:00', sub_league_id: 11 },
    //   { game_play_id: 12, game_plays: 'WE', kick_off_time_1: '07:00', kick_off_time_2: '08:00', sub_league_id: 11 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Gameplays', null, {});
  },
};
