module.exports = (sequelize, DataTypes) => {
  const Ecode = sequelize.define('Ecode', {
    ecode: { type: DataTypes.STRING(10), allowNull: false },
    is_used: { type: DataTypes.BOOLEAN, defaultValue: false },
    used_datetime: { type: DataTypes.DATE, allowNull: true },
  });
  return Ecode;
};
