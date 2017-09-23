'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    underscored: true
  })
  User.associate = function(models) {
      User.hasMany(models.Task, {
        foreignKey: 'user_id'
      })
  }

  return User
};