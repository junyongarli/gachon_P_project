// routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // DB 모델에서 User를 가져옵니다.
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ## 회원가입 API (/api/auth/register)
router.post('/register', async (req, res) => {
  // 프론트엔드에서 보낸 username, email, password를 받습니다.
  const { username, email, password } = req.body;

  try {
    // 1. 이미 가입된 이메일인지 확인
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      // 409 Conflict: 리소스 충돌 (이미 존재하는 이메일)
      return res.status(409).json({ success: false, message: '이미 사용 중인 이메일입니다.' });
    }

    // 2. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10); // 10번 반복해서 암호화

    // 3. 데이터베이스에 새로운 사용자 저장
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword, // 암호화된 비밀번호를 저장
    });

    // 4. 성공 응답 보내기
    // 201 Created: 리소스 생성 성공
    res.status(201).json({ success: true, message: '회원가입에 성공했습니다.', userId: newUser.id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// ## 로그인 API (/api/auth/login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. 이메일로 사용자 찾기
    const user = await User.findOne({ where: { email } });

    // 2. 사용자가 없거나, 비밀번호가 틀리면 에러 응답
    if (!user || !(await bcrypt.compare(password, user.password))) {
      // 401 Unauthorized: 인증 실패
      return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ message: '정지된 계정입니다. 고객센터에 문의하세요.' });
    }
    // 3. JWT 토큰 생성
    const token = jwt.sign(
      { id: user.id, role: user.role }, // 토큰에 담을 정보
      process.env.JWT_SECRET_KEY,         // .env 파일의 비밀 키
      { expiresIn: '1h' }                // 유효기간 (1시간)
    );
    
    // 4. 성공 응답 (토큰과 사용자 정보 함께 보내기)
    res.json({
      success: true,
      access_token: token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});
// -------------------------------------------------------
// 비밀번호 변경 API (PUT /api/auth/update-password)
// -------------------------------------------------------
router.put('/update-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // 미들웨어에서 해독한 사용자 ID

    // 1. 사용자 찾기
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    // 2. 현재 비밀번호 확인 (DB에 저장된 해시 비밀번호와 비교)
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: '현재 비밀번호가 일치하지 않습니다.' });
    }

    // 3. 새 비밀번호 암호화 및 저장
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });

  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// -------------------------------------------------------
// 회원 탈퇴 API (DELETE /api/auth/delete-account)
// -------------------------------------------------------
router.delete('/delete-account', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. 사용자 찾기
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    // 2. 사용자 삭제 (DB 설정에 따라 연관된 찜 목록 등도 같이 삭제될 수 있음)
    await user.destroy();

    res.json({ success: true, message: '회원 탈퇴가 완료되었습니다.' });

  } catch (error) {
    console.error('회원 탈퇴 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});
module.exports = router;