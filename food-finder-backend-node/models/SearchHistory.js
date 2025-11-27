// models/SearchHistory.js
// 사용자의 검색 기록을 저장하는 모델

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SearchHistory = sequelize.define('SearchHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE', // 사용자 삭제 시 함께 삭제
    },
    // 검색 유형
    searchType: {
      type: DataTypes.ENUM('quiz', 'ai_chat', 'keyword', 'distance'),
      allowNull: false,
      comment: 'quiz: 퀴즈 검색, ai_chat: AI 대화, keyword: 키워드, distance: 거리 기반',
    },
    // 검색어/퀴즈 답변
    searchQuery: {
      type: DataTypes.JSON, // { answers: ['korean', 'spicy'], keyword: '김치찌개' } 등
      allowNull: true,
      comment: '검색에 사용된 퀴즈 답변 또는 키워드',
    },
    // 검색 위치
    searchLocation: {
      type: DataTypes.JSON, // { latitude: 37.123, longitude: 127.456, address: '서울시...' }
      allowNull: true,
      comment: '검색 시 사용된 위치 정보',
    },
    // 검색 결과 수
    resultCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: '검색 결과로 나온 맛집 개수',
    },
    // 클릭한 맛집 ID
    clickedRestaurantId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '사용자가 클릭한 맛집의 카카오 ID',
    },
    // 클릭한 맛집 이름
    clickedRestaurantName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '사용자가 클릭한 맛집 이름',
    },
    // 찜 여부
    isBookmarked: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: '해당 검색 결과를 찜했는지 여부',
    },
    // 검색 시간
    searchedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'search_histories',
    timestamps: true, // createdAt, updatedAt 자동 생성
    indexes: [
      {
        fields: ['userId', 'searchedAt'], // 사용자별 최근 검색 조회 최적화
      },
    ],
  });

  // 모델 간 관계 설정
  SearchHistory.associate = (models) => {
    SearchHistory.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return SearchHistory;
};
