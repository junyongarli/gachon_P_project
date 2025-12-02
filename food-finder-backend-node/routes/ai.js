// routes/ai.js
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { Favorite } = require('../models'); 
const { protect } = require('../middleware/authMiddleware');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL_ID = process.env.FINE_TUNED_MODEL_ID || "gpt-3.5-turbo"; 

// 1. [강화된] JSON 문자열 청소 함수
function cleanJsonString(str) {
    if (!str) return "";
    
    // (1) 마크다운 코드 블록 제거 (```json ... ```)
    let cleaned = str.replace(/^```json\s*/, '').replace(/^```/, '').replace(/```$/, '').trim();
    
    // (2) 흔한 JSON 실수 교정 (중복 닫기 괄호 제거)
    // 예: "}}" -> "}"
    cleaned = cleaned.replace(/}}\s*]/g, "}]").replace(/]\s*}/g, "]}");
    
    // (3) 맨 뒤에 불필요한 콤마 제거 (Trailing Comma)
    cleaned = cleaned.replace(/,\s*}/g, "}");
    cleaned = cleaned.replace(/,\s*]/g, "]");

    return cleaned;
}

// 2. 키워드 매핑 함수 (기존과 동일 + 보완)
function mapToKeyword(text) {
    const t = text || "";
    
    if (t.includes('한식') || t.includes('백반') || t.includes('정식') || t.includes('집밥') || t.includes('죽')) return 'korean';
    if (t.includes('양식') || t.includes('파스타') || t.includes('피자') || t.includes('스테이크') || t.includes('브런치')) return 'western';
    if (t.includes('중식') || t.includes('짜장') || t.includes('짬뽕') || t.includes('마라') || t.includes('탕수육')) return 'chinese'; 
    if (t.includes('일식') || t.includes('초밥') || t.includes('스시') || t.includes('라멘') || t.includes('돈가스') || t.includes('덮밥')) return 'japanese';
    if (t.includes('디저트') || t.includes('카페') || t.includes('빵') || t.includes('커피') || t.includes('차')) return 'sweet';

    if (t.includes('고기') || t.includes('삼겹살') || t.includes('갈비') || t.includes('육류') || t.includes('차돌') || t.includes('치킨')) return 'meat';
    if (t.includes('해산물') || t.includes('회') || t.includes('생선') || t.includes('조개') || t.includes('게장') || t.includes('물회')) return 'seafood';
    if (t.includes('면') || t.includes('국수') || t.includes('우동') || t.includes('소바')) return 'noodle';
    if (t.includes('밥')) return 'rice';

    if (t.includes('매운') || t.includes('얼큰') || t.includes('칼칼') || t.includes('화끈')) return 'spicy';
    if (t.includes('순한') || t.includes('담백') || t.includes('깔끔') || t.includes('지리')) return 'mild';
    if (t.includes('따뜻') || t.includes('뜨끈') || t.includes('국물') || t.includes('탕') || t.includes('찌개') || t.includes('전골')) return 'hot';
    if (t.includes('시원') || t.includes('차가운') || t.includes('냉') || t.includes('아이스')) return 'cold';
    if (t.includes('짭짤') || t.includes('간장') || t.includes('단짠')) return 'salty';

    if (t.includes('술') || t.includes('안주') || t.includes('포차') || t.includes('맥주') || t.includes('소주') || t.includes('와인')) return 'alcohol';
    if (t.includes('혼밥') || t.includes('혼자')) return 'alone';
    if (t.includes('단체') || t.includes('회식') || t.includes('모임') || t.includes('가족')) return 'group';
    if (t.includes('분위기') || t.includes('데이트') || t.includes('예쁜') || t.includes('야경')) return 'modern';
    if (t.includes('전통') || t.includes('노포') || t.includes('시장')) return 'traditional';
        
    if (t.includes('근처') || t.includes('가까운') || t.includes('주변') || t.includes('동네') || t.includes('도보')) return 'near';
    if (t.includes('멀리') || t.includes('이동') || t.includes('차량') || t.includes('드라이브') || t.includes('교외')) return 'far';
    return null; // 알 수 없는 말은 무시
}

router.post('/quiz/generate', protect, async (req, res) => {
    console.log(`[AI 요청 시작] 사용 모델: ${MODEL_ID}`);

    try {
        const userId = req.user.id;
        const { location, time, weather } = req.body;

        const favorites = await Favorite.findAll({
            where: { userId },
            attributes: ['restaurant_name', 'category'],
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        const favData = favorites.map(f => `${f.restaurant_name}(${f.category})`).join(', ');
        const favContext = favorites.length > 0 ? `선호: ${favData}` : `정보 없음`;

        const completion = await openai.chat.completions.create({
            model: MODEL_ID,
            messages: [
                {
                    role: "system",
                    content: `당신은 '맛맵'의 취향 파악 퀴즈 생성기입니다.
                    사용자의 상황과 선호를 분석하여 맛집 추천을 위한 '이지선다' 질문 5개를 JSON으로 생성하세요.
                    
                    [규칙]
                    1. 반드시 JSON 형식만 출력하세요. (설명 금지)
                    2. 정확히 5개의 질문을 만드세요.
                    3. 답변(a, b)에는 음식 종류, 재료, 맛, 분위기 등 구체적인 키워드를 넣으세요.
                    
                    [형식 예시]
                    {
                        "questions": [
                            {"q": "질문 내용", "a": "선택지A", "b": "선택지B"},
                            ... (총 5개) ...
                        ]
                    }`
                },
                {
                    role: "user",
                    content: `위치: ${location}, 시간: ${time}, 날씨: ${weather || ''}. [${favContext}]`
                }
            ],
            temperature: 0.7
        });

        const rawContent = completion.choices[0].message.content;
        console.log("[AI 원본 응답]:", rawContent);

        // JSON 파싱 및 보정
        let result;
        try {
            const cleanedContent = cleanJsonString(rawContent);
            result = JSON.parse(cleanedContent);
        } catch (parseError) {
            console.error("[JSON 파싱 실패]:", parseError.message);
            // 한 번 더 시도 (끝부분 잘림 보정)
            try {
                const fixEnd = rawContent.trim().replace(/]+$/, '') + "]}"; 
                result = JSON.parse(fixEnd);
                console.log("[JSON 자동 복구 성공]");
            } catch (retryError) {
                 console.error("[JSON 복구 실패, 기본 질문 사용]");
                 throw new Error("JSON 파싱 불가");
            }
        }

        // 데이터 검증
        if (!result.questions || !Array.isArray(result.questions)) {
            throw new Error("questions 배열이 없습니다.");
        }

        // 변환
        const formattedQuestions = result.questions.map((item) => ({
            question: item.q,
            options: [
                { text: item.a, value: mapToKeyword(item.a) },
                { text: item.b, value: mapToKeyword(item.b) }
            ]
        }));

        console.log("[최종 변환 성공]:", formattedQuestions.length, "개 질문 생성됨");
        res.json({ success: true, data: formattedQuestions });

    } catch (error) {
        console.error("[최종 에러 발생]:", error.message);
        res.json({ success: false, data: [], error: error.message });
    }
});

module.exports = router;