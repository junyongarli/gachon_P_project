import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { MapPin, Phone, ExternalLink, Heart  } from 'lucide-react';

const questions = [
  // ... (질문 내용은 그대로) ...
  { id: 1, question: "어떤 맛을 선호하시나요?", options: [{ text: "매콤한 음식", value: "spicy" }, { text: "담백한 음식", value: "mild" }] },
  { id: 2, question: "어떤 스타일의 음식을 원하시나요?", options: [{ text: "든든한 한식", value: "korean" }, { text: "가벼운 양식", value: "western" }] },
  { id: 3, question: "주식으로 무엇을 선호하시나요?", options: [{ text: "면 요리", value: "noodle" }, { text: "밥 요리", value: "rice" }] },
  { id: 4, question: "어떤 재료를 선호하시나요?", options: [{ text: "고기 요리", value: "meat" }, { text: "해산물 요리", value: "seafood" }] },
  { id: 5, question: "어떤 온도의 음식을 원하시나요?", options: [{ text: "따뜻한 국물", value: "hot" }, { text: "시원한 음식", value: "cold" }] },
  { id: 6, question: "식사 후 무엇을 원하시나요?", options: [{ text: "달콤한 디저트", value: "sweet" }, { text: "짭짤한 간식", value: "salty" }] },
  { id: 7, question: "어떤 분위기를 선호하시나요?", options: [{ text: "전통적인 맛", value: "traditional" }, { text: "이국적인 맛", value: "modern" }] },
  { id: 8, question: "누구와 함께 드시나요?", options: [{ text: "혼밥하기 좋은 곳", value: "alone" }, { text: "여럿이 가기 좋은 곳", value: "group" }] }
];


// ▼▼▼ KakaoMap 컴포넌트를 아래와 같이 수정합니다 ▼▼▼
const KakaoMap = ({ restaurants, userLocation }) => {
  useEffect(() => {
    const kakaoMapScript = document.createElement('script');
    kakaoMapScript.async = false;
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&autoload=false`;
    document.head.appendChild(kakaoMapScript);

    const onLoadKakaoAPI = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          if (!container) return;

          const mapCenter = userLocation
            ? new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude)
            : restaurants.length > 0
            ? new window.kakao.maps.LatLng(restaurants[0].y, restaurants[0].x)
            : new window.kakao.maps.LatLng(37.566826, 126.9786567);
          
          const options = { center: mapCenter, level: 5 };
          const map = new window.kakao.maps.Map(container, options);

          restaurants.forEach(restaurant => {
            const markerPosition = new window.kakao.maps.LatLng(restaurant.y, restaurant.x);
            const marker = new window.kakao.maps.Marker({ position: markerPosition, map: map });
            const iwContent = `<div style="padding:5px; font-size:12px; max-width:200px; text-align:center;">${restaurant.name}</div>`;
            const infowindow = new window.kakao.maps.InfoWindow({ content: iwContent });
            window.kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker));
            window.kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());
          });
        });
      }
    };

    // 스크립트가 로드된 후에 지도를 렌더링합니다.
    kakaoMapScript.addEventListener('load', onLoadKakaoAPI);

    // 컴포넌트가 언마운트될 때 스크립트 태그를 제거하는 클린업 함수 (선택 사항)
    return () => {
      kakaoMapScript.removeEventListener('load', onLoadKakaoAPI);
      document.head.removeChild(kakaoMapScript);
    };
  }, [restaurants, userLocation]);

  return <div id="map" style={{ width: '100%', height: '400px', borderRadius: '8px', marginBottom: '24px' }}></div>;
};
// ▲▲▲ 여기까지 수정 ▲▲▲


function QuizPage() {
  const [currentStep, setCurrentStep] = useState('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // ▼▼▼ QuizPage에 있던 스크립트 로딩 useEffect는 이제 필요 없으므로 삭제합니다. ▼▼▼
  /*
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);
  }, []);
  */
  // ▲▲▲ 이 부분을 삭제 ▲▲▲
  
  const handleStart = () => { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition( (position) => { setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude }); setCurrentStep('questions'); }, (error) => { setCurrentStep('questions'); } ); } else { setCurrentStep('questions'); } };
  const handleAnswer = (questionId, answer) => { const newAnswers = { ...answers, [questionId]: answer.value }; setAnswers(newAnswers); if (currentQuestionIndex < questions.length - 1) { setCurrentQuestionIndex(currentQuestionIndex + 1); } else { searchRestaurants(newAnswers); } };
  const searchRestaurants = async (userAnswers) => { setCurrentStep('loading'); try { const response = await fetch('/api/restaurant/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers: Object.values(userAnswers), location: userLocation }) }); const data = await response.json(); if (data.success) { setRestaurants(data.restaurants); } else { setRestaurants([]); } } catch (error) { setRestaurants([]); } setCurrentStep('results'); };
  const resetQuiz = () => { setCurrentStep('start'); setCurrentQuestionIndex(0); setAnswers({}); setRestaurants([]); };

  // ... (if (currentStep === ...) return JSX 부분은 그대로) ...
  if (currentStep === 'start') { return ( <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4"> <Card className="w-full max-w-md text-center"> <CardHeader> <CardTitle className="text-2xl font-bold text-gray-800"> 🍽️ 맛집 추천 AI </CardTitle> <CardDescription className="text-lg"> 몇 가지 질문에 답하시면<br /> 당신의 취향에 맞는 맛집을 찾아드려요! </CardDescription> </CardHeader> <CardContent> <Button onClick={handleStart} className="w-full text-lg py-6" size="lg"> 시작하기 </Button> </CardContent> </Card> </div> ); }
  if (currentStep === 'questions') { const currentQuestion = questions[currentQuestionIndex]; return ( <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4"> <Card className="w-full max-w-md"> <CardHeader> <div className="flex justify-between items-center mb-2"> <Badge variant="secondary"> {currentQuestionIndex + 1} / {questions.length} </Badge> <div className="w-32 bg-gray-200 rounded-full h-2"> <div className="bg-orange-500 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} ></div> </div> </div> <CardTitle className="text-xl"> {currentQuestion.question} </CardTitle> </CardHeader> <CardContent className="space-y-3"> {currentQuestion.options.map((option, index) => ( <Button key={index} variant="outline" className="w-full text-left justify-start h-auto py-4 px-4" onClick={() => handleAnswer(currentQuestion.id, option)} > <span className="text-lg">{option.text}</span> </Button> ))} </CardContent> </Card> </div> ); }
  if (currentStep === 'loading') { return ( <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4"> <Card className="w-full max-w-md text-center"> <CardContent className="py-12"> <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div> <CardTitle className="text-xl mb-2">맛집을 찾고 있어요...</CardTitle> <CardDescription> 당신의 취향에 맞는 최고의 맛집을 검색 중입니다 </CardDescription> </CardContent> </Card> </div> ); }
  if (currentStep === 'results') {
    const allOptionsMap = {};
    questions.forEach(question => { question.options.forEach(option => { allOptionsMap[option.value] = option.text; }); });
    const summaryText = Object.values(answers).map(value => allOptionsMap[value]).join(', ');
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-lg font-semibold text-gray-700">🎉 추천 맛집</p>
            <p className="text-gray-800 font-semibold bg-orange-100 rounded-md p-2 mt-2">당신의 선택: {summaryText}</p>
          </div>
          <KakaoMap restaurants={restaurants} userLocation={userLocation} />
          <div className="space-y-4 mb-6">
            {restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6"><div className="flex justify-between items-start mb-3">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-800">{restaurant.name}</h3>
                    <Badge variant="secondary" className="mt-1">{restaurant.category}</Badge>
                  </div>
                  <a href={restaurant.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">상세보기<ExternalLink className="w-4 h-4 ml-2" /></Button>
                  </a>
                  <Button onClick={() => handleFavorite(restaurant)} variant="ghost" size="icon">
                        <Heart className="w-5 h-5" />
                  </Button>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" /><span>{restaurant.address}</span>
                    </div>
                    <div className="flex items-center"><Phone className="w-4 h-4 mr-2 flex-shrink-0" /><span>{restaurant.phone || '전화번호 정보 없음'}</span></div>
                  </div>
                  </CardContent>
                </Card>
              ))
            ) : ( <Card><CardContent className="p-6 text-center text-gray-600"><p>추천할 맛집을 찾지 못했어요. 😥</p><p>다른 조건으로 다시 검색해보세요!</p></CardContent></Card> )}
          </div>
          <div className="text-center">
            <Button onClick={resetQuiz} variant="outline" size="lg">다시 검색하기</Button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default QuizPage;