'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userName: DataTypes.STRING,
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    noHp: DataTypes.STRING,
    address: DataTypes.STRING,
    salt: DataTypes.STRING,
    password: DataTypes.STRING,
    isActive: DataTypes.INTEGER,
    deleted: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};