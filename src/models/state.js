module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
    state_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    country_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    iso2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    updated_at: {
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

  State.associate = (models) => {
    State.belongsTo(models.Country, { foreignKey: 'country_id' });
    State.hasMany(models.City, { foreignKey: 'state_id' });
  };

  return State;
};
