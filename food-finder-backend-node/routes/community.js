// routes/community.js
const express = require('express');
const router = express.Router();
const { Notice, Inquiry, User } = require('../models');
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
// 6. [Admin] 전체 문의사항 목록 조회
router.get('/admin/inquiries', protect, admin, async (req, res) => {
  try {
    const inquiries = await Inquiry.findAll({
      include: [{
        model: User,
        as: 'user', // [핵심 수정] 여기에 alias(별칭)를 명시해야 합니다!
        attributes: ['username', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    const formattedInquiries = inquiries.map(inq => ({
      id: inq.id,
      category: inq.category,
      title: inq.title,
      content: inq.content,
      answer: inq.answer,
      status: inq.status || 'pending',
      createdAt: inq.createdAt,
      answeredAt: inq.updatedAt,
      // [수정] 대문자 User -> 소문자 user (alias를 따라갑니다)
      username: inq.user ? inq.user.username : '알 수 없음',
      email: inq.user ? inq.user.email : '-'
    }));

    res.json({ success: true, inquiries: formattedInquiries });
  } catch (error) {
    console.error("문의 조회 에러:", error);
    res.status(500).json({ success: false, message: '문의 목록을 불러오지 못했습니다.' });
  }
});

// 7. [Admin] 문의사항 답변 등록
router.post('/admin/inquiries/:id/reply', protect, admin, async (req, res) => {
  try {
    const inquiryId = req.params.id;
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({ success: false, message: '답변 내용을 입력해주세요.' });
    }

    const inquiry = await Inquiry.findByPk(inquiryId);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: '해당 문의를 찾을 수 없습니다.' });
    }

    // 답변 업데이트 및 상태 변경
    await inquiry.update({
      answer: answer,
      status: 'completed' // 답변 완료 상태로 변경
    });

    res.json({ success: true, message: '답변이 등록되었습니다.' });

  } catch (error) {
    console.error("답변 등록 에러:", error);
    res.status(500).json({ success: false, message: '답변 등록 실패' });
  }
});

// 8. [Admin] 문의 상태 수동 변경 (대기중 <-> 완료)
router.put('/admin/inquiries/:id/status', protect, admin, async (req, res) => {
    try {
        const inquiryId = req.params.id;
        const { status } = req.body; // 'pending' or 'completed'
        
        await Inquiry.update({ status }, { where: { id: inquiryId } });
        res.json({ success: true, message: '상태가 변경되었습니다.' });
    } catch (error) {
        res.status(500).json({ success: false, message: '상태 변경 실패' });
    }
});
// 9. [User] 내 문의 내역 조회
router.get('/inquiries/my', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const inquiries = await Inquiry.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, inquiries });
    } catch (error) {
        console.error("내 문의 조회 오류:", error);
        res.status(500).json({ success: false, message: '문의 내역을 불러오지 못했습니다.' });
    }
});

// 10. [User] 내 문의 삭제 (답변 달리기 전(pending) 상태일 때만 삭제 가능하도록 제한 가능)
router.delete('/inquiries/:id', protect, async (req, res) => {
    try {
        const inquiryId = req.params.id;
        const userId = req.user.id;

        const inquiry = await Inquiry.findOne({ where: { id: inquiryId, userId } });
        
        if (!inquiry) {
            return res.status(404).json({ success: false, message: '해당 문의를 찾을 수 없거나 권한이 없습니다.' });
        }

        await inquiry.destroy();
        res.json({ success: true, message: '문의가 삭제되었습니다.' });

    } catch (error) {
        res.status(500).json({ success: false, message: '삭제 실패' });
    }
});

// 11. [User] 문의 수정 (답변 달리기 전만 가능)
router.put('/inquiries/:id', protect, async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const inquiryId = req.params.id;
        const userId = req.user.id;

        const inquiry = await Inquiry.findOne({ where: { id: inquiryId, userId } });

        if (!inquiry) {
            return res.status(404).json({ success: false, message: '문의를 찾을 수 없습니다.' });
        }

        if (inquiry.status === 'completed') {
             return res.status(400).json({ success: false, message: '이미 답변이 완료된 문의는 수정할 수 없습니다.' });
        }

        await inquiry.update({ title, content, category });
        res.json({ success: true, message: '문의가 수정되었습니다.' });

    } catch (error) {
        res.status(500).json({ success: false, message: '수정 실패' });
    }
});
module.exports = router;