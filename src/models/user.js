module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    gender: { type: DataTypes.STRING, allowNull: false },
    category_subcategory: { type: DataTypes.STRING, allowNull: false },
    place: { type: DataTypes.STRING, allowNull: false },
    dob: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    jersey_no: { type: DataTypes.INTEGER, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  });
  return User;
};
