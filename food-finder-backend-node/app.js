require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRouter = require('./routes/auth');
const restaurantRouter = require('./routes/restaurant');
const favoritesRouter = require('./routes/favorites');
const adminRouter = require('./routes/admin');
const communityRouter = require('./routes/community');
const aiRouter = require('./routes/ai');
//const personalizationRouter = require('./routes/personalization'); 

const app = express();

app.use(cors());
app.use(express.json());

// API 라우트 연결
app.use('/api/ai', aiRouter);
app.use('/api/auth', authRouter);
app.use('/api/restaurant', restaurantRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/community', communityRouter);
//app.use('/api/personalization', personalizationRouter);

const PORT = process.env.PORT || 5000;

// 데이터베이스와 동기화 후 서버 실행
sequelize.sync({ force: false }) // true로 하면 서버 재시작마다 테이블이 삭제 후 재생성됨
  .then(() => {
    console.log('✅ 데이터베이스 연결 성공');
    app.listen(PORT, () => {
      console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    });
  })
  .catch((err) => {
    console.error('❌ 데이터베이스 연결 실패:', err);
  });