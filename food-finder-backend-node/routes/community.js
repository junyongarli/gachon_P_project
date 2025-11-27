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
  console.log("📝 [DEBUG] 문의 등록 요청 받음");
  console.log("👤 [DEBUG] 사용자 정보(req.user):", req.user);
  console.log("📦 [DEBUG] 요청 데이터(req.body):", req.body);

  const { category, title, content } = req.body;

  // 유효성 검사
  if (!category || !title || !content) {
    console.error("❌ [ERROR] 필수 데이터 누락");
    return res.status(400).json({ success: false, message: '필수 데이터가 누락되었습니다.' });
  }

  try {
    const newInquiry = await Inquiry.create({
      userId: req.user.id, // 여기서 에러가 나는지 확인
      category,
      title,
      content
    });
    
    console.log("✅ [SUCCESS] 문의 저장 완료:", newInquiry.id);
    res.status(201).json({ success: true, message: '문의가 접수되었습니다.' });

  } catch (error) {
    console.error("❌ [ERROR] DB 저장 실패"); // 여기가 핵심입니다!
    res.status(500).json({ success: false, message: '문의 등록 실패: ' + error.message });
  }
});

module.exports = router;