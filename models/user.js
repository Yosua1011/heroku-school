'use strict';
const generate = require('../helpers/saltGenerator')
const hash = require('../helpers/hash')

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (data) => {
        const secret = generate()
        data.salt = secret
        data.password = hash(data.password, secret)
      }
    }
  });
  return User;
};