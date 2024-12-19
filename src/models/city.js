module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    city_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    state_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    country_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
  });

  City.associate = (models) => {
    City.belongsTo(models.State, { foreignKey: 'state_id' });
    City.belongsTo(models.Country, { foreignKey: 'country_id' });
  };

  return City;
};
