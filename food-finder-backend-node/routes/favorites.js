// routes/favorites.js

const express = require('express');
const { Favorite } = require('../models');
const { protect } = require('../middleware/authMiddleware'); // '로그인' 경비원 불러오기

const router = express.Router();

// ## 맛집 찜하기 API (/api/favorites)
// 'protect' 경비원이 먼저 실행되고, 통과해야만 다음 async 함수가 실행됩니다.
router.post('/', protect, async (req, res) => {
  const userId = req.user.id; // 경비원이 심어준 사용자 ID
  const { restaurant_id, restaurant_name, category, address, phone, url } = req.body;

  try {
    const existing = await Favorite.findOne({ where: { userId, restaurant_id } });
    if (existing) {
      return res.status(409).json({ success: false, message: '이미 찜한 맛집입니다.' });
    }

    const newFavorite = await Favorite.create({
      userId, restaurant_id, restaurant_name, category, address, phone, url
    });

    res.status(201).json({ success: true, message: '맛집을 찜했습니다.', favorite: newFavorite });
  } catch (error) {
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// ## 찜한 맛집 목록 불러오기 API (/api/favorites)
router.get('/', protect, async (req, res) => {
  const userId = req.user.id;
  try {
    const favorites = await Favorite.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']] // 최신순으로 정렬
    });
    res.json({ success: true, favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});
// ## 🆕 찜한 맛집 삭제 API (이 부분을 추가!)
router.delete('/:id', protect, async (req, res) => {
  const userId = req.user.id;
  const favoriteId = req.params.id;

  try {
    // 해당 찜이 존재하고, 본인의 찜인지 확인
    const favorite = await Favorite.findOne({
      where: { id: favoriteId, userId }
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: '찜한 맛집을 찾을 수 없습니다.'
      });
    }

    // 삭제 실행
    await favorite.destroy();

    res.json({
      success: true,
      message: '찜 목록에서 삭제되었습니다.'
    });
  } catch (error) {
    console.error('찜 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

module.exports = router;