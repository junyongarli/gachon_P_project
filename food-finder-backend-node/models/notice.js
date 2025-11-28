// models/notice.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Notice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT, // 긴 내용도 담을 수 있게 TEXT 타입
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'general', // event, maintenance, update, etc.
    },
    isImportant: { // 상단 고정 등을 위한 중요도 체크
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    timestamps: true, // createdAt, updatedAt 자동 생성
  });
};