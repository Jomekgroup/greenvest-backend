const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./User');

const Investment = db.define('Investment', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  nextPayoutDate: {
    type: DataTypes.DATE
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

// Link investment to user
User.hasMany(Investment);
Investment.belongsTo(User);

module.exports = Investment;
