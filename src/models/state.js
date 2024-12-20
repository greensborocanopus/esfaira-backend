module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define(
    'State',
    {
      state_id: {
        type: DataTypes.STRING, // Change to STRING
        primaryKey: true,
        allowNull: false, // Ensure this field is always populated
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      country_id: {
        type: DataTypes.STRING, // Change to STRING
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'States', // Explicitly mention table name for clarity
      timestamps: false, // Disable default Sequelize timestamps
      underscored: true, // Use snake_case for database field names
    }
  );

  State.associate = (models) => {
    // Define the relationship with the 'Country' model
    State.belongsTo(models.Country, { foreignKey: 'country_id', as: 'country' });

    // Define the relationship with the 'City' model
    State.hasMany(models.City, { foreignKey: 'state_id', as: 'cities' });
  };

  return State;
};
