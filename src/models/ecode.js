module.exports = (sequelize, DataTypes) => {
  const Ecode = sequelize.define('Ecode', {
    ecode: { 
      type: DataTypes.STRING(10), 
      allowNull: false 
    },
    is_used: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
    used_datetime: { 
      type: DataTypes.DATE, 
      allowNull: true 
    },
    user_id: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      references: {
        model: 'Users', // Name of the users table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    is_send: { type: DataTypes.BOOLEAN, defaultValue: false }, // New field
  });

  return Ecode;
};
