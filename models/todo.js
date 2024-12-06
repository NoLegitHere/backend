const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Todo = sequelize.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  priority: {
    type: DataTypes.ENUM,
    values: ['Low', 'Medium', 'High', 'Critical'],
    defaultValue: 'Low'
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

sequelize.sync()
  .then(() => console.log('Database & tables created!'))
  .catch(err => console.log(err));

module.exports = Todo;
