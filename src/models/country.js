module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('Country', {
    id: {
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true,
    },
    shortname: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    phonecode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: true,
    },
  });

  Country.associate = (models) => {
    Country.belongsTo(models.Currency, { foreignKey: 'currency', as: 'currencyDetails' });
    Country.hasMany(models.State, { foreignKey: 'country_id' });
    Country.hasMany(models.City, { foreignKey: 'country_id' });
  };

  return Country;
};
