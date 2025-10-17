// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// 로그인 여부를 검사하는 경비원
const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization; // 요청 헤더에서 Authorization 정보 확인

  // 헤더에 'Bearer' 토큰이 있는지 확인
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // 'Bearer ' 부분을 잘라내고 실제 토큰 값만 추출
      token = authHeader.split(' ')[1];

      // 토큰이 유효한지 비밀 키로 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // 검증에 성공하면, 요청(req) 객체에 사용자 정보를 심어둠
      // 이렇게 하면 다음 단계(실제 API)에서 req.user.id 형태로 사용자 정보를 쉽게 꺼내 쓸 수 있음
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next(); // 검문 통과! 다음 단계(API 로직)로 이동
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: '인증 실패: 토큰이 유효하지 않습니다.' });
    }
  }

  // 토큰이 아예 없는 경우
  if (!token) {
    res.status(401).json({ success: false, message: '인증 실패: 토큰이 없습니다.' });
  }
};

// 관리자 여부를 검사하는 경비원
const admin = (req, res, next) => {
    // protect 경비원이 미리 심어둔 req.user 정보를 확인
    if (req.user && req.user.role === 'admin') {
        next(); // 관리자 확인! 다음 단계로 이동
    } else {
        res.status(403).json({ success: false, message: '접근 권한이 없습니다. (관리자 전용)' }); // 403 Forbidden: 접근 거부
    }
};

module.exports = { protect, admin };