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
      type: DataTypes.STRING(255), 
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
      type: DataTypes.STRING(255), 
    },
    // phone, url은 그대로 유지하되, 화면에서만 안 보여주면 됩니다.
    phone: {
      type: DataTypes.STRING(50),
    },
    url: {
      type: DataTypes.STRING(255),
    },
    // [추가됨] 별점 (소수점 저장)
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    // [추가됨] 총 리뷰 수 (정수)
    user_ratings_total: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  });

  return Favorite;
};