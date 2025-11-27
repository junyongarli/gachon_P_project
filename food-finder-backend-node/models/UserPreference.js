// models/UserPreference.js
// 사용자의 개인화 학습 데이터를 저장하는 모델

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserPreference = sequelize.define('UserPreference', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // 한 사용자당 하나의 프로필만
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE', // 사용자 삭제 시 함께 삭제
    },
    // 음식 선호도
    favoriteCuisines: {
      type: DataTypes.JSON, // ['korean', 'western', 'japanese']
      allowNull: true,
      defaultValue: [],
      comment: '선호하는 음식 종류 리스트',
    },
    favoriteIngredients: {
      type: DataTypes.JSON, // ['meat', 'seafood']
      allowNull: true,
      defaultValue: [],
      comment: '선호하는 재료 리스트',
    },
    favoriteFlavors: {
      type: DataTypes.JSON, // ['spicy', 'hot']
      allowNull: true,
      defaultValue: [],
      comment: '선호하는 맛/특징 리스트',
    },
    // 거리 선호도
    preferredDistance: {
      type: DataTypes.ENUM('near', 'medium', 'far'),
      allowNull: true,
      defaultValue: 'medium',
      comment: 'near: 500m, medium: 2km, far: 5km',
    },
    // 가격대 선호도
    preferredPriceRange: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: true,
      defaultValue: 'medium',
      comment: 'low: 1만원 이하, medium: 1~2만원, high: 2만원 이상',
    },
    // 분위기 선호도
    preferredAtmosphere: {
      type: DataTypes.JSON, // ['casual', 'modern', 'traditional']
      allowNull: true,
      defaultValue: [],
      comment: '선호하는 분위기 리스트',
    },
    // 동행 선호도
    preferredCompanion: {
      type: DataTypes.ENUM('alone', 'friend', 'family', 'date', 'group'),
      allowNull: true,
      comment: '주로 함께 가는 사람 유형',
    },
    // 학습된 점수 (자동 계산)
    learningScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: '학습 데이터 신뢰도 점수 (검색/클릭 횟수 기반)',
    },
    // 마지막 업데이트 시간
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'user_preferences',
    timestamps: true, // createdAt, updatedAt 자동 생성
  });

  // 모델 간 관계 설정
  UserPreference.associate = (models) => {
    UserPreference.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return UserPreference;
};
