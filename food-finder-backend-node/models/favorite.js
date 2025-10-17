// models/favorite.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Favorite = sequelize.define('Favorite', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    restaurant_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    restaurant_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
    },
    address: {
      type: DataTypes.STRING(200),
    },
    phone: {
      type: DataTypes.STRING(50),
    },
    url: {
      type: DataTypes.STRING(255),
    },
  });

  return Favorite;
};