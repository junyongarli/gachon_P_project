const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// [핵심] ChatLog 모델을 포함하여 가져옵니다.
const { Favorite, ChatLog } = require('../models'); 
const { protect } = require('../middleware/authMiddleware');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 파인튜닝 모델 ID (없으면 기본 모델 사용)
const MODEL_ID = process.env.FINE_TUNED_MODEL_ID || "gpt-3.5-turbo"; 

// 1. [강화된] JSON 문자열 청소 함수
function cleanJsonString(str) {
    if (!str) return "";
    
    // (1) 마크다운 및 JSON 포맷 정리
    let cleaned = str.replace(/^```json\s*/, '').replace(/^```/, '').replace(/```$/, '').trim();
    
    // (2) 흔한 JSON 실수 교정 (중복 닫기 괄호 제거)
    cleaned = cleaned.replace(/}}\s*]/g, "}]").replace(/]\s*}/g, "]}");
    
    // (3) 맨 뒤에 불필요한 콤마 제거
    cleaned = cleaned.replace(/,\s*}/g, "}");
    cleaned = cleaned.replace(/,\s*]/g, "]");

    // (4) AI가 뱉은 이상한 태그(#@...#)를 자연스러운 말로 치환
    cleaned = cleaned.replace(/#@LOCATION#/g, "근처"); 
    cleaned = cleaned.replace(/#@소속#/g, "추천");
    cleaned = cleaned.replace(/#@.*?#/g, "이 곳"); 

    return cleaned;
}

// 2. 키워드 매핑 함수 (기존 유지)
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
    return null; 
}

// ==========================================
// [A] 퀴즈 질문 생성 API
// ==========================================
router.post('/quiz/generate', protect, async (req, res) => {
    console.log(`[AI 퀴즈 요청] 사용 모델: ${MODEL_ID}`);

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
        
        let result;
        try {
            const cleanedContent = cleanJsonString(rawContent);
            result = JSON.parse(cleanedContent);
        } catch (parseError) {
            console.error("[JSON 파싱 실패]:", parseError.message);
            try {
                const fixEnd = rawContent.trim().replace(/]+$/, '') + "]}"; 
                result = JSON.parse(fixEnd);
            } catch (retryError) {
                 throw new Error("JSON 파싱 불가");
            }
        }

        if (!result.questions || !Array.isArray(result.questions)) {
            throw new Error("questions 배열이 없습니다.");
        }

        const formattedQuestions = result.questions.map((item) => ({
            question: item.q,
            options: [
                { text: item.a, value: mapToKeyword(item.a) },
                { text: item.b, value: mapToKeyword(item.b) }
            ]
        }));

        res.json({ success: true, data: formattedQuestions });

    } catch (error) {
        console.error("[퀴즈 생성 에러]:", error.message);
        res.json({ success: false, data: [], error: error.message });
    }
});

// ==========================================
// [B] 스마트 검색 (대화형) API
// ==========================================
router.post('/smart-search', protect, async (req, res) => {
    console.log(`[스마트 검색] 사용자: ${req.body.message}`);

    try {
        const userId = req.user.id;
        const { message, userLocation, history } = req.body;

        // 1. 찜 목록 조회
        let favContext = "없음";
        try {
            const favorites = await Favorite.findAll({
                where: { userId },
                attributes: ['restaurant_name', 'category'],
                limit: 10,
                order: [['createdAt', 'DESC']]
            });
            if (favorites.length > 0) {
                favContext = favorites.map(f => `${f.restaurant_name}(${f.category})`).join(', ');
            }
        } catch (err) {
            console.warn("찜 목록 조회 실패 (무시):", err.message);
        }

        // 2. 대화 로그(ChatLog) 조회 (과거 취향 분석 - 횟수 정보 제거)
        let prefContext = "데이터 없음";
        try {
            if (typeof ChatLog !== 'undefined') { 
                const recentLogs = await ChatLog.findAll({
                    where: { userId },
                    order: [['createdAt', 'DESC']],
                    limit: 20,
                    attributes: ['keywords']
                });

                const keywordCounts = {};
                recentLogs.forEach(log => {
                    if (log.keywords) {
                        const words = log.keywords.split(',');
                        words.forEach(w => {
                            const word = w.trim();
                            if (word) keywordCounts[word] = (keywordCounts[word] || 0) + 1;
                        });
                    }
                });

                // [수정] 횟수(val)는 제거하고 키워드만 나열하여 AI의 집착 방지
                const topKeywords = Object.entries(keywordCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([key, val]) => `${key}`) 
                    .join(', ');
                
                if (topKeywords) prefContext = topKeywords;
            }
        } catch (dbError) {
            console.warn("⚠️ 대화 로그 조회 실패 (무시):", dbError.message);
        }

        console.log(`[사용자 과거 키워드]: ${prefContext}`);

        // 3. 위치 정보 문자열 생성
        let locationInfo = "위치 정보 없음";
        if (userLocation && userLocation.lat && userLocation.lng) {
             locationInfo = `위도 ${userLocation.lat}, 경도 ${userLocation.lng} (사용자의 현재 위치임)`;
        }

        const conversationHistory = history ? history.slice(-6) : [];

        // 4. AI 호출 (프롬프트: 기존 구조 유지 + 거절/다양성 강화)
        const completion = await openai.chat.completions.create({
            model: MODEL_ID, 
            messages: [
                {
                    role: "system",
                    content: `당신은 '맛맵'의 유연하고 똑똑한 맛집 추천 AI입니다. 다음 규칙을 엄격히 준수하여 JSON으로 응답하세요.

                    [필수 규칙: 위치 처리]
                    1. [현재 위치] 정보가 좌표(위도/경도)로 주어지면, 사용자가 "근처", "주변", "내 위치"라고 할 때 **절대 "위치를 모른다"고 하지 마세요.**
                    2. 대신 "계신 곳 근처에서 찾아드릴게요!" 또는 "주변 맛집을 검색합니다"라고 자연스럽게 응대하고, 'CURRENT_LOCATION' 타입으로 반환하세요.

                    [핵심 가치 1: 다양성과 의외성 (집착 금지)]
                    - 찜 목록과 과거 키워드는 단순 참고용일 뿐입니다. 50% 확률로 이와 다른 새로운 스타일을 제안하세요.
                    - **거절("싫어", "아니", "말고")** 시 **직전에 언급된 메뉴나 스타일은 절대 다시 추천하지 말고, 즉시 다른 카테고리로 전환하세요.**
                    - 문맥 최우선: 사용자가 구체적인 조건(매운거, 국물 등)을 말하면 과거 취향은 무시하고 그 조건에 집중하세요.

                    [핵심 가치 2: 검색 유형 판단]
                    - CURRENT_LOCATION: "근처", "주변", "내 위치" 언급 시 (좌표 있을 때).
                    - SPECIFIC_REGION: "강남", "홍대" 등 지역명 명시 시.

                    [🚨 검색어 생성 기준 (신중함)]
                    - 사용자가 "배고파", "추천해줘" 처럼 **메뉴나 분위기를 말하지 않았다면** searchQuery를 null로 하고 질문을 하세요.

                    [추가 임무: 키워드 추출]
                    - 사용자의 발언에서 핵심 맛집 키워드(음식명, 맛, 분위기, 지역 등)를 추출하여 'extractedKeywords' 배열에 담아주세요.

                    [JSON 출력 형식]
                    { 
                        "searchQuery": "구글맵 검색어 (정보가 충분할 때만 작성, 부족하면 null)", 
                        "searchType": "CURRENT_LOCATION" 또는 "SPECIFIC_REGION", 
                        "reply": "사용자에게 건넬 말",
                        "extractedKeywords": ["키워드1", "키워드2"]
                    }`
                },
                ...conversationHistory, 
                {
                    role: "user",
                    content: `
                    [참고 자료 1: 찜 목록]: ${favContext}
                    [참고 자료 2: 과거 대화 키워드(단순 언급된 단어들이니 맹신 금지)]: ${prefContext}
                    [현재 위치]: ${locationInfo}
                    [사용자 메시지]: "${message}"
                    
                    위 정보를 바탕으로 답변하고, 위치 유형 판단 및 키워드 추출을 수행해. **사용자가 싫다고 한 건 절대 권하지 마.**`
                }
            ],
            temperature: 0.8, // 다양성을 위해 창의성 높임
            response_format: { type: "json_object" }
        });

        const rawContent = completion.choices[0].message.content;
        console.log("[AI 응답]:", rawContent);

        let aiData;
        try {
            aiData = JSON.parse(cleanJsonString(rawContent)); 
        } catch (e) {
            aiData = { searchQuery: null, searchType: "CURRENT_LOCATION", reply: "죄송합니다. 잠시 후 다시 시도해 주세요.", extractedKeywords: [] };
        }

        // 5. 대화 로그 저장 (비동기)
        if (typeof ChatLog !== 'undefined' && aiData.extractedKeywords && Array.isArray(aiData.extractedKeywords) && aiData.extractedKeywords.length > 0) {
            const keywordsString = aiData.extractedKeywords.join(',');
            
            ChatLog.create({
                userId,
                query: message,
                keywords: keywordsString,
                suggestedQuery: aiData.searchQuery
            }).catch(err => console.warn("로그 저장 실패 (무시):", err.message));
        }

        res.json({
            success: true,
            searchQuery: aiData.searchQuery || null,
            searchType: aiData.searchType || "CURRENT_LOCATION",
            aiMessage: aiData.reply || "어떤 음식을 찾으시나요?",
            extractedInfo: aiData 
        });

    } catch (error) {
        console.error("[스마트 검색 에러]:", error);
        res.status(500).json({ success: false, message: "AI 처리 중 오류 발생" });
    }
});

module.exports = router;