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
      attributes: ['id', 'username', 'email', 'role', 'status', 'createdAt'] // 보안을 위해 비밀번호는 제외
    });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});
router.put('/users/:id/status', [protect, admin], async (req, res) => {
  try {
    const { status } = req.body; // 'active' or 'suspended'
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 관리자 자신은 정지 불가 (옵션)
    if (user.role === 'admin' && user.id === req.user.id) {
        return res.status(400).json({ message: '자기 자신을 정지할 수 없습니다.' });
    }

    user.status = status;
    await user.save();

    res.json({ success: true, message: `사용자 상태가 ${status}로 변경되었습니다.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '상태 변경 중 오류가 발생했습니다.' });
  }
});

// ## 3. 사용자 삭제 API
router.delete('/users/:id', [protect, admin], async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    if (user.role === 'admin') {
       return res.status(403).json({ message: '관리자 계정은 삭제할 수 없습니다.' });
    }

    await user.destroy();
    res.json({ success: true, message: '사용자가 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '사용자 삭제 중 오류가 발생했습니다.' });
  }
});
module.exports = router;