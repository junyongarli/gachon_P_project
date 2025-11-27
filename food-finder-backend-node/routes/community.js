// routes/community.js
const express = require('express');
const router = express.Router();
const { Notice, Inquiry } = require('../models');
const { protect } = require('../middleware/authMiddleware');

// 1. 공지사항 목록 조회 (누구나 접근 가능)
// GET /api/community/notices
router.get('/notices', async (req, res) => {
  try {
    const notices = await Notice.findAll({
      order: [['createdAt', 'DESC']] // 최신순 정렬
    });
    res.json({ success: true, notices });
  } catch (error) {
    res.status(500).json({ success: false, message: '공지사항 조회 실패' });
  }
});

// 2. 1:1 문의 등록 (로그인 사용자만)
// POST /api/community/inquiries
router.post('/inquiries', protect, async (req, res) => {
  const { category, title, content } = req.body;
  try {
    await Inquiry.create({
      userId: req.user.id, // 토큰에서 추출한 사용자 ID
      category,
      title,
      content
    });
    res.status(201).json({ success: true, message: '문의가 접수되었습니다.' });
  } catch (error) {
    res.status(500).json({ success: false, message: '문의 등록 실패' });
  }
});

module.exports = router;