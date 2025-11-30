const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Inquiry = sequelize.define('Inquiry', {
    category: { // '이용문의', '계정관리' 등
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: { // 'waiting'(대기중), 'completed'(답변완료)
      type: DataTypes.STRING,
      defaultValue: 'waiting',
    },
    answer: { // 관리자 답변
      type: DataTypes.TEXT,
      allowNull: true,
    }
  });
  return Inquiry;
};