module.exports = (sequelize, DataTypes) => {
  const League = sequelize.define('League', {
      organization: DataTypes.STRING,
      league: DataTypes.STRING,
      sports_complex: DataTypes.STRING,
      venue: DataTypes.STRING,
      season: DataTypes.STRING,
      website: DataTypes.STRING,
      category: DataTypes.STRING,
      game_format: DataTypes.STRING,
      minimum_players_per_team: DataTypes.INTEGER,
      league_price_per_team: DataTypes.DECIMAL(10, 2),
      match_duration: DataTypes.STRING,
      type_of_league: DataTypes.STRING,
      number_of_fields_available: DataTypes.INTEGER,
      number_of_teams_competing: DataTypes.INTEGER,
      bank_name: DataTypes.STRING,
      beneficiary_bank_account_number: DataTypes.STRING,
      company_name: DataTypes.STRING,
      email: DataTypes.STRING,
  });
  return League;
};
