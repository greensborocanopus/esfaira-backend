module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    unique_id: { type: DataTypes.STRING, allowNull: false, unique: true }, // Add unique_id field
    gender: { type: DataTypes.STRING, allowNull: false },
    category_subcategory: { type: DataTypes.STRING, allowNull: false },
    place: { type: DataTypes.STRING, allowNull: false },
    dob: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    jersey_no: { type: DataTypes.INTEGER, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    reset_token: { type: DataTypes.STRING, allowNull: true }, // To store the reset token
    reset_token_expiry: { type: DataTypes.DATE, allowNull: true }, // To store token expiration time
  });
  return User;
};
