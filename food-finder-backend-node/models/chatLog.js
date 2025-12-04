// models/chatLog.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ChatLog = sequelize.define('ChatLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // 사용자가 실제로 입력한 메시지 (예: "강남역 매운거 추천해줘")
    query: {
      type: DataTypes.STRING(255), 
      allowNull: false,
    },
    // AI가 추출한 핵심 키워드 (예: "강남,매운맛,한식") -> 쉼표로 구분해서 저장
    keywords: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // (선택 사항) AI가 추천해준 검색어
    suggestedQuery: {
      type: DataTypes.STRING(255),
      allowNull: true,
    }
  }, {
    tableName: 'chat_logs', // 설계서에 맞춘 테이블 이름
    timestamps: true,       // 생성 시간(createdAt) 자동 기록
  });

  return ChatLog;
};