const { DataTypes } = require('sequelize');
const db = require('../config/db');

const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  balance: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  investment: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  referralCode: {
    type: DataTypes.STRING,
    unique: true
  },
  referredBy: {
    type: DataTypes.STRING
  },
  referralBonus: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  country: {
    type: DataTypes.STRING
  }
});

module.exports = User;
