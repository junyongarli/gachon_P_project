// routes/admin.js

const express = require('express');
const { User } = require('../models');
const { protect, admin } = require('../middleware/authMiddleware'); // '로그인', '관리자' 경비원 모두 불러오기

const router = express.Router();

// ## 전체 사용자 목록 조회 API (/api/admin/users)
// 요청은 'protect'를 먼저 통과하고, 그 다음 'admin'을 통과해야 합니다.
router.get('/users', [protect, admin], async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt'] // 보안을 위해 비밀번호는 제외
    });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;