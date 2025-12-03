// routes/community.js
const express = require('express');
const router = express.Router();
const { Notice, Inquiry } = require('../models');
// [수정] admin 미들웨어 추가 가져오기
const { protect, admin } = require('../middleware/authMiddleware');

// 1. 공지사항 목록 조회 API (누구나 접근 가능)
router.get('/notices', async (req, res) => {
  try {
    const notices = await Notice.findAll({
      order: [
        ['isImportant', 'DESC'], // 중요 공지 우선
        ['createdAt', 'DESC']    // 최신순
      ],
    });
    // [수정] 프론트엔드가 { success: true, notices: [] } 형태를 기대하므로 포맷 통일
    res.json({ success: true, notices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '공지사항을 불러오는데 실패했습니다.' });
  }
});

// 2. [추가] 공지사항 등록 API (관리자 전용)
router.post('/notices', protect, admin, async (req, res) => {
  try {
    const { title, category, content, isImportant } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: '제목과 내용을 입력해주세요.' });
    }

    const newNotice = await Notice.create({
      title,
      category: category || '일반',
      content,
      isImportant: isImportant || false,
      // 작성자 ID (관리자) 저장
      adminId: req.user.id 
    });

    res.status(201).json({ success: true, message: '공지사항이 등록되었습니다.', notice: newNotice });

  } catch (error) {
    console.error('공지사항 등록 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 3. [추가] 공지사항 삭제 API (관리자 전용)
router.delete('/notices/:id', protect, admin, async (req, res) => {
  try {
    const noticeId = req.params.id;
    const notice = await Notice.findByPk(noticeId);

    if (!notice) {
      return res.status(404).json({ success: false, message: '해당 공지사항을 찾을 수 없습니다.' });
    }

    await notice.destroy();
    res.json({ success: true, message: '공지사항이 삭제되었습니다.' });

  } catch (error) {
    console.error('공지사항 삭제 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});
// [추가] 4. 공지사항 수정 API (관리자 전용)
router.put('/notices/:id', protect, admin, async (req, res) => {
  try {
    const noticeId = req.params.id;
    const { title, category, content, isImportant } = req.body;

    // 수정할 공지사항 찾기
    const notice = await Notice.findByPk(noticeId);
    if (!notice) {
      return res.status(404).json({ success: false, message: '해당 공지사항을 찾을 수 없습니다.' });
    }

    // 데이터 업데이트
    await notice.update({
      title,
      category,
      content,
      isImportant: isImportant || false
    });

    res.json({ success: true, message: '공지사항이 수정되었습니다.', notice });

  } catch (error) {
    console.error('공지사항 수정 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});
// 5. 1:1 문의 등록 (기존 코드 유지)
router.post('/inquiries', protect, async (req, res) => {
  const { category, title, content } = req.body;
  if (!category || !title || !content) {
    return res.status(400).json({ success: false, message: '필수 데이터가 누락되었습니다.' });
  }
  try {
    await Inquiry.create({
      userId: req.user.id,
      category, title, content
    });
    res.status(201).json({ success: true, message: '문의가 접수되었습니다.' });
  } catch (error) {
    res.status(500).json({ success: false, message: '문의 등록 실패' });
  }
});

module.exports = router;