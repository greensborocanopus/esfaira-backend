module.exports = (sequelize, DataTypes) => {
  const Currency = sequelize.define('Currency', {
    currency_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(32),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Title cannot be empty' },
        len: { args: [1, 32], msg: 'Title must be between 1 and 32 characters long' },
      },
    },
    code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Code cannot be empty' },
        isAlpha: { msg: 'Code must contain only letters' },
        len: { args: [1, 3], msg: 'Code must be 1 to 3 characters long' },
      },
    },
    symbol: {
      type: DataTypes.STRING(12),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Symbol cannot be empty' },
        len: { args: [1, 12], msg: 'Symbol must be between 1 and 12 characters long' },
      },
    },
    value: {
      type: DataTypes.DOUBLE(15, 3),
      allowNull: false,
      validate: {
        isNumeric: { msg: 'Value must be a number' },
        min: { args: [0], msg: 'Value must be greater than or equal to 0' },
      },
    },
    status: {
      type: DataTypes.TINYINT(1),
      defaultValue: 1,
      validate: {
        isIn: { args: [[0, 1]], msg: 'Status must be 0 (inactive) or 1 (active)' },
      },
    },
  });

  Currency.associate = (models) => {
    Currency.hasMany(models.Country, { foreignKey: 'currency' });
  };

  return Currency;
};
