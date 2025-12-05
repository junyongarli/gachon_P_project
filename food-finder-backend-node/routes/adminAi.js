const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const OpenAI = require('openai');
const { protect, admin } = require('../middleware/authMiddleware'); // 관리자 권한 미들웨어 가정

// OpenAI 설정
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 파일 업로드를 위한 Multer 설정 (temp 폴더에 임시 저장)
const upload = multer({ dest: 'uploads/' });

// ==========================================
// 1. [POST] 파인튜닝 작업 생성 (데이터 업로드 -> 학습 시작)
// 경로: /api/admin/ai/train
// ==========================================
router.post('/train', protect, upload.single('trainingFile'), async (req, res) => {
    try {
        console.log("[AI 학습] 요청 수신");
        const { modelName, epochs, batchSize, learningRate } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: "학습 데이터 파일이 없습니다." });
        }

        // 1. OpenAI에 파일 업로드
        console.log("[AI 학습] 1. OpenAI 파일 업로드 중...");
        const openaiFile = await openai.files.create({
            file: fs.createReadStream(file.path),
            purpose: "fine-tune",
        });

        // 2. 파인튜닝 작업 생성
        console.log(`[AI 학습] 2. 학습 작업 시작 (Base Model: gpt-3.5-turbo, File ID: ${openaiFile.id})`);
        
        // hyperparameter 설정 (auto가 아니면 값 할당)
        const hyperparameters = {};
        if (epochs) hyperparameters.n_epochs = parseInt(epochs) || 'auto';
        // batch_size와 learning_rate_multiplier는 OpenAI API 스펙에 따라 필요 시 추가

        const job = await openai.fineTuning.jobs.create({
            training_file: openaiFile.id,
            model: "gpt-3.5-turbo", // 비용 절감을 위해 3.5-turbo 사용 (설계서의 gpt-4o-mini는 현재 파인튜닝 미지원일 수 있으니 확인 필요, 지원시 변경)
            suffix: modelName || "matmap-custom",
            hyperparameters: hyperparameters
        });

        // 3. 임시 파일 삭제
        fs.unlinkSync(file.path);

        console.log("[AI 학습] 작업 생성 완료 ID:", job.id);

        res.json({
            success: true,
            message: "학습 작업이 시작되었습니다.",
            jobId: job.id,
            status: job.status
        });

    } catch (error) {
        console.error("[AI 학습 실패]:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 2. [GET] 학습 상태 조회
// 경로: /api/admin/ai/jobs/:jobId
// ==========================================
router.get('/jobs/:jobId', protect, async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await openai.fineTuning.jobs.retrieve(jobId);

        // 이벤트 로그 조회 (옵션)
        const events = await openai.fineTuning.jobs.listEvents(jobId, { limit: 10 });

        res.json({
            success: true,
            status: job.status,
            fine_tuned_model: job.fine_tuned_model,
            progress: events.data // 상세 로그
        });
    } catch (error) {
        console.error("[상태 조회 실패]:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 3. [GET] 학습된 모델 목록 조회
// 경로: /api/admin/ai/models
router.get('/models', async (req, res) => {
    try {
        console.log("[AI] 모델 목록 조회 요청");
        
        // 1. OpenAI에서 파인튜닝 작업 목록 가져오기 (최근 10개)
        const list = await openai.fineTuning.jobs.list({ limit: 10 });
        
        // 2. 프론트엔드 형식에 맞춰 데이터 매핑
        const models = list.data.map(job => ({
            id: job.fine_tuned_model || job.id, // 모델 ID가 없으면(실패 등) Job ID 표시
            name: job.user_provided_suffix || `Custom Model (${job.id.slice(-4)})`, // 사용자가 지정한 이름 접미사
            version: 'v1.0', // 버전 관리는 별도 DB가 없다면 임의 지정
            trainedAt: new Date(job.created_at * 1000).toLocaleString(),
            accuracy: 'N/A', // OpenAI API는 정확도 수치를 직접 제공하지 않음
            status: job.status === 'succeeded' ? 'active' : job.status, // succeeded -> active로 매핑
            dataSize: job.training_file, // 파일 ID
            epochs: job.hyperparameters.n_epochs || 'Auto',
            description: `Base Model: ${job.model}`,
            jobId: job.id // 상세 조회용 Job ID
        }));

        res.json({
            success: true,
            models: models
        });

    } catch (error) {
        console.error("[AI] 모델 목록 조회 실패:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;