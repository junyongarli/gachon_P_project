// routes/favorites.js
const express = require('express');
const { Favorite } = require('../models');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// 1. 맛집 찜하기 (기존 유지)
router.post('/', protect, async (req, res) => {
  const userId = req.user.id;
  const { restaurant_id, restaurant_name, category, address, phone, url, rating, user_ratings_total } = req.body;

  try {
    const existing = await Favorite.findOne({ where: { userId, restaurant_id } });
    if (existing) {
      return res.status(409).json({ success: false, message: '이미 찜한 맛집입니다.' });
    }

    const newFavorite = await Favorite.create({
      userId, restaurant_id, restaurant_name, category, address, phone, url,
      rating: rating || 0,
      user_ratings_total: user_ratings_total || 0
    });

    res.status(201).json({ success: true, message: '맛집을 찜했습니다.', favorite: newFavorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 2. 찜 목록 불러오기 (기존 유지)
router.get('/', protect, async (req, res) => {
  const userId = req.user.id;
  try {
    const favorites = await Favorite.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 3. [기존] ID로 삭제 (찜 목록 페이지용)
router.delete('/:id', protect, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await Favorite.destroy({ where: { id: req.params.id, userId } });
    if (!result) return res.status(404).json({ success: false, message: '찾을 수 없습니다.' });
    res.json({ success: true, message: '삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ success: false, message: '오류 발생' });
  }
});

// 4. [NEW!] 구글 장소 ID로 삭제 (퀴즈/검색 페이지용) - 이 부분을 추가하세요!
router.delete('/restaurant/:restaurantId', protect, async (req, res) => {
  const userId = req.user.id;
  const restaurantId = req.params.restaurantId;

  try {
    const result = await Favorite.destroy({
      where: { userId, restaurant_id: restaurantId }
    });
    
    // 삭제된 행이 없어도 에러는 아님 (이미 삭제된 상태)
    res.json({ success: true, message: '찜 목록에서 삭제되었습니다.' });
  } catch (error) {
    console.error('삭제 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;