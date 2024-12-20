module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define(
    'City',
    {
      city_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true, // Ensure auto-increment for city_id
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      state_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'Cities', // Explicitly mention table name
      timestamps: false, // Disable Sequelize timestamps
      underscored: true, // Use snake_case for database field names
    }
  );

  City.associate = (models) => {
    // Define the relationship with the 'State' model
    City.belongsTo(models.State, { foreignKey: 'state_id', as: 'state' });
  };

  return City;
};
