// routes/personalization.js
// 사용자 개인화 학습 데이터를 관리하는 API

const express = require('express');
const { UserPreference, SearchHistory } = require('../models');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ## 개인화 프로필 조회 API (/api/personalization/profile)
router.get('/profile', protect, async (req, res) => {
  const userId = req.user.id;

  try {
    let profile = await UserPreference.findOne({ where: { userId } });

    // 프로필이 없으면 기본값으로 생성
    if (!profile) {
      profile = await UserPreference.create({
        userId,
        favoriteCuisines: [],
        favoriteIngredients: [],
        favoriteFlavors: [],
        preferredDistance: 'medium',
        preferredPriceRange: 'medium',
        preferredAtmosphere: [],
        learningScore: 0,
      });
    }

    res.json({ success: true, profile });
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// ## 개인화 프로필 업데이트 API (/api/personalization/profile)
router.put('/profile', protect, async (req, res) => {
  const userId = req.user.id;
  const {
    favoriteCuisines,
    favoriteIngredients,
    favoriteFlavors,
    preferredDistance,
    preferredPriceRange,
    preferredAtmosphere,
    preferredCompanion,
  } = req.body;

  try {
    let profile = await UserPreference.findOne({ where: { userId } });

    if (!profile) {
      // 프로필이 없으면 새로 생성
      profile = await UserPreference.create({
        userId,
        favoriteCuisines: favoriteCuisines || [],
        favoriteIngredients: favoriteIngredients || [],
        favoriteFlavors: favoriteFlavors || [],
        preferredDistance: preferredDistance || 'medium',
        preferredPriceRange: preferredPriceRange || 'medium',
        preferredAtmosphere: preferredAtmosphere || [],
        preferredCompanion: preferredCompanion || null,
        learningScore: 0,
        lastUpdated: new Date(),
      });
    } else {
      // 기존 프로필 업데이트
      await profile.update({
        favoriteCuisines: favoriteCuisines !== undefined ? favoriteCuisines : profile.favoriteCuisines,
        favoriteIngredients: favoriteIngredients !== undefined ? favoriteIngredients : profile.favoriteIngredients,
        favoriteFlavors: favoriteFlavors !== undefined ? favoriteFlavors : profile.favoriteFlavors,
        preferredDistance: preferredDistance || profile.preferredDistance,
        preferredPriceRange: preferredPriceRange || profile.preferredPriceRange,
        preferredAtmosphere: preferredAtmosphere !== undefined ? preferredAtmosphere : profile.preferredAtmosphere,
        preferredCompanion: preferredCompanion !== undefined ? preferredCompanion : profile.preferredCompanion,
        lastUpdated: new Date(),
      });
    }

    res.json({ success: true, message: '개인화 프로필이 업데이트되었습니다.', profile });
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// ## 검색 기록 저장 API (/api/personalization/history)
router.post('/history', protect, async (req, res) => {
  const userId = req.user.id;
  const {
    searchType,
    searchQuery,
    searchLocation,
    resultCount,
    clickedRestaurantId,
    clickedRestaurantName,
    isBookmarked,
  } = req.body;

  try {
    const history = await SearchHistory.create({
      userId,
      searchType,
      searchQuery: searchQuery || null,
      searchLocation: searchLocation || null,
      resultCount: resultCount || 0,
      clickedRestaurantId: clickedRestaurantId || null,
      clickedRestaurantName: clickedRestaurantName || null,
      isBookmarked: isBookmarked || false,
      searchedAt: new Date(),
    });

    // 검색 기록이 쌓이면 학습 점수 증가
    const profile = await UserPreference.findOne({ where: { userId } });
    if (profile) {
      await profile.update({
        learningScore: profile.learningScore + 1,
        lastUpdated: new Date(),
      });
    }

    res.status(201).json({ success: true, message: '검색 기록이 저장되었습니다.', history });
  } catch (error) {
    console.error('검색 기록 저장 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// ## 검색 기록 조회 API (/api/personalization/history)
router.get('/history', protect, async (req, res) => {
  const userId = req.user.id;
  const { limit = 20, offset = 0 } = req.query;

  try {
    const histories = await SearchHistory.findAll({
      where: { userId },
      order: [['searchedAt', 'DESC']], // 최신순 정렬
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalCount = await SearchHistory.count({ where: { userId } });

    res.json({
      success: true,
      histories,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('검색 기록 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// ## 개인화 추천 데이터 생성 API (/api/personalization/recommendations)
// 검색 기록과 프로필을 분석하여 추천 검색어 생성
router.get('/recommendations', protect, async (req, res) => {
  const userId = req.user.id;

  try {
    const profile = await UserPreference.findOne({ where: { userId } });
    const recentHistories = await SearchHistory.findAll({
      where: { userId },
      order: [['searchedAt', 'DESC']],
      limit: 10, // 최근 10개 검색 기록만 분석
    });

    // 기본 추천 데이터
    let recommendations = {
      suggestedCuisines: [],
      suggestedKeywords: [],
      frequentSearches: [],
    };

    // 프로필 기반 추천
    if (profile) {
      recommendations.suggestedCuisines = [
        ...profile.favoriteCuisines,
        ...profile.favoriteIngredients,
      ].slice(0, 5);
    }

    // 검색 기록 기반 추천
    if (recentHistories.length > 0) {
      // 자주 검색한 키워드 추출
      const keywordFrequency = {};
      recentHistories.forEach(history => {
        if (history.searchQuery && history.searchQuery.answers) {
          history.searchQuery.answers.forEach(answer => {
            keywordFrequency[answer] = (keywordFrequency[answer] || 0) + 1;
          });
        }
      });

      // 빈도순 정렬
      recommendations.frequentSearches = Object.entries(keywordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([keyword]) => keyword);
    }

    res.json({ success: true, recommendations });
  } catch (error) {
    console.error('추천 데이터 생성 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// ## 개인화 데이터 초기화 API (/api/personalization/reset)
router.delete('/reset', protect, async (req, res) => {
  const userId = req.user.id;

  try {
    // 프로필 초기화
    await UserPreference.destroy({ where: { userId } });
    
    // 검색 기록 삭제 (선택적)
    const { deleteHistory } = req.query;
    if (deleteHistory === 'true') {
      await SearchHistory.destroy({ where: { userId } });
    }

    res.json({
      success: true,
      message: '개인화 데이터가 초기화되었습니다.',
    });
  } catch (error) {
    console.error('개인화 데이터 초기화 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
