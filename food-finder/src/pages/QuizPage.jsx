import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, ExternalLink, Heart, Utensils, Sparkles, ChefHat, UtensilsCrossed } from 'lucide-react';
import { motion } from 'motion/react';

const questions = [
  { id: 1, question: "어떤 맛을 선호하시나요?", options: [{ text: "매콤한 음식", value: "spicy" }, { text: "담백한 음식", value: "mild" }] },
  { id: 2, question: "어떤 스타일의 음식을 원하시나요?", options: [{ text: "든든한 한식", value: "korean" }, { text: "가벼운 양식", value: "western" }] },
  { id: 3, question: "주식으로 무엇을 선호하시나요?", options: [{ text: "면 요리", value: "noodle" }, { text: "밥 요리", value: "rice" }] },
  { id: 4, question: "어떤 재료를 선호하시나요?", options: [{ text: "고기 요리", value: "meat" }, { text: "해산물 요리", value: "seafood" }] },
  { id: 5, question: "어떤 온도의 음식을 원하시나요?", options: [{ text: "따뜻한 국물", value: "hot" }, { text: "시원한 음식", value: "cold" }] },
  { id: 6, question: "식사 후 무엇을 원하시나요?", options: [{ text: "달콤한 디저트", value: "sweet" }, { text: "짭짤한 간식", value: "salty" }] },
  { id: 7, question: "어떤 분위기를 선호하시나요?", options: [{ text: "전통적인 맛", value: "traditional" }, { text: "이국적인 맛", value: "modern" }] },
  { id: 8, question: "누구와 함께 드시나요?", options: [{ text: "혼밥하기 좋은 곳", value: "alone" }, { text: "여럿이 가기 좋은 곳", value: "group" }] }
];

const GoogleMap = ({ restaurants, userLocation }) => {
  useEffect(() => {
    // 구글맵 스크립트 로드
    const googleMapScript = document.createElement('script');
    googleMapScript.async = true;
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    document.head.appendChild(googleMapScript);

    const onLoadGoogleAPI = () => {
      if (window.google && window.google.maps) {
        const container = document.getElementById('map');
        if (!container) return;

        // 지도 중심 설정
        const mapCenter = userLocation
          ? { lat: userLocation.latitude, lng: userLocation.longitude }
          : restaurants.length > 0
          ? { lat: restaurants[0].y, lng: restaurants[0].x }
          : { lat: 37.566826, lng: 126.9786567 }; // 서울 시청
        
        // 구글맵 생성
        const map = new window.google.maps.Map(container, {
          center: mapCenter,
          zoom: 14,
        });

        // 마커와 인포윈도우 추가
        restaurants.forEach(restaurant => {
          const marker = new window.google.maps.Marker({
            position: { lat: restaurant.y, lng: restaurant.x },
            map: map,
            title: restaurant.name,
          });

          const infowindow = new window.google.maps.InfoWindow({
            content: `<div style="padding:5px; font-size:12px; max-width:200px; text-align:center;">${restaurant.name}</div>`,
          });

          marker.addListener('mouseover', () => {
            infowindow.open(map, marker);
          });

          marker.addListener('mouseout', () => {
            infowindow.close();
          });
        });
      }
    };

    googleMapScript.addEventListener('load', onLoadGoogleAPI);

    return () => {
      googleMapScript.removeEventListener('load', onLoadGoogleAPI);
      if (document.head.contains(googleMapScript)) {
        document.head.removeChild(googleMapScript);
      }
    };
  }, [restaurants, userLocation]);

  return <div id="map" className="w-full rounded-xl" style={{ height: '500px' }}></div>;
};

function QuizPage() {
  // AuthContext에서 실제 로그인 상태 가져오기
  const { token } = useAuth();
  
  const [currentStep, setCurrentStep] = useState('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [favorites, setFavorites] = useState(new Set()); // 찜한 레스토랑 ID 저장
  
  const handleFavorite = async (restaurant) => {
    // 로그인 안한 상태에서 찜하기 시도 시
    if (!token) {
      alert("찜하기 기능은 로그인이 필요합니다.");
      return;
    }

    // 찜 상태 토글
    const newFavorites = new Set(favorites);
    if (newFavorites.has(restaurant.id)) {
      newFavorites.delete(restaurant.id);
    } else {
      newFavorites.add(restaurant.id);
    }
    setFavorites(newFavorites);

    // 로그인한 상태에서 찜하기
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurant_id: restaurant.id,
          restaurant_name: restaurant.name,
          category: restaurant.category,
          address: restaurant.address,
          phone: restaurant.phone,
          url: restaurant.url,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`${restaurant.name} 식당이 찜목록에 저장되었습니다.`);
      } else {
        alert(data.message || '찜하기에 실패했습니다.');
      }
    } catch (error) {
      alert('찜하기 요청 중 오류가 발생했습니다.');
    }
  };

  const handleStart = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setCurrentStep('questions');
        },
        (error) => {
          setCurrentStep('questions');
        }
      );
    } else {
      setCurrentStep('questions');
    }
  };

  const handleAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer.value };
    setAnswers(newAnswers);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      searchRestaurants(newAnswers);
    }
  };

  const searchRestaurants = async (userAnswers) => {
    setCurrentStep('loading'); // 로딩 화면 다시 활성화
    try {
      const response = await fetch('/api/restaurant/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.values(userAnswers),
          location: userLocation
        })
      });
      const data = await response.json();
      if (data.success) {
        setRestaurants(data.restaurants);
      } else {
        setRestaurants([]);
      }
    } catch (error) {
      setRestaurants([]);
    }
    setCurrentStep('results');
  };

  const resetQuiz = () => {
    setCurrentStep('start');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setRestaurants([]);
  };

  // START 화면
  if (currentStep === 'start') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* 로고 아이콘 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-white p-6 rounded-full shadow-xl">
                <ChefHat className="w-16 h-16 text-orange-500" />
              </div>
            </div>
          </motion.div>

          <Card className="bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                <CardTitle className="text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  맛맵
                </CardTitle>
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
              <CardDescription className="text-lg text-gray-600">
                몇 가지 질문에 답하시면<br />
                당신의 취향에 맞는 맛집을 찾아드려요!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleStart}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 py-6 text-lg"
                size="lg"
              >
                <Utensils className="w-5 h-5 mr-2" />
                시작하기
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // QUESTIONS 화면
  if (currentStep === 'questions') {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* 그라데이션 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
        
        {/* 배경 장식 요소 */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* 상단 진행 바 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm"
        >
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 p-2 rounded-lg">
                  <UtensilsCrossed className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">질문</p>
                  <p className="font-bold text-gray-800">{currentQuestionIndex + 1} / {questions.length}</p>
                </div>
              </div>
              {currentQuestionIndex > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  className="text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                >
                  이전 질문
                </Button>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full shadow-md"
              ></motion.div>
            </div>
          </div>
        </motion.div>

        {/* 질문 영역 */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-140px)] p-6">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-3xl"
          >
            {/* 질문 타이틀 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-12"
            >
              <h2 className="text-5xl text-gray-800 mb-4">
                {currentQuestion.question}
              </h2>
              <p className="text-xl text-gray-600">선택지를 눌러주세요</p>
            </motion.div>

            {/* 선택지 버튼들 */}
            <div className="space-y-5">
              {currentQuestion.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-auto py-8 px-10 text-2xl bg-white/90 backdrop-blur-sm border-3 border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl shadow-lg rounded-2xl"
                    onClick={() => handleAnswer(currentQuestion.id, option)}
                  >
                    <span className="text-gray-800">{option.text}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CSS 애니메이션 */}
        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  // LOADING 화면
  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* 그라이션 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 text-center"
        >
          <h2 className="text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            맛집을 찾는 중<span className="animate-pulse">...</span>
          </h2>
        </motion.div>
      </div>
    );
  }

  // RESULTS 화면
  if (currentStep === 'results') {
    const allOptionsMap = {};
    questions.forEach(question => {
      question.options.forEach(option => {
        allOptionsMap[option.value] = option.text;
      });
    });
    const summaryText = Object.values(answers).map(value => allOptionsMap[value]).join(', ');

    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* 그라데이션 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
        
        {/* 배경 장식 요소 */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

        {/* 상단 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    추천 맛집
                  </h2>
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-gray-600">
                  <span className="text-orange-600">당신의 선택:</span> {summaryText}
                </p>
              </div>
              <Button
                onClick={resetQuiz}
                variant="outline"
                className="bg-white hover:bg-orange-50 border-2 border-orange-300 hover:border-orange-400 text-orange-600 hover:text-orange-700 transition-all duration-300"
              >
                <Utensils className="w-4 h-4 mr-2" />
                다시 검색하기
              </Button>
            </div>
          </div>
        </motion.div>

        {/* 메인 콘텐츠: 2단 분할 */}
        <div className="relative z-10 max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* 왼쪽: 지도 (고정) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full lg:w-2/5 lg:sticky lg:top-6"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    지도
                  </h3>
                  <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white border-none">
                    {restaurants.length}개 발견
                  </Badge>
                </div>
                <GoogleMap restaurants={restaurants} userLocation={userLocation} />
              </div>
            </motion.div>

            {/* 오른쪽: 레스토랑 목록 (스크롤) */}
            <div className="w-full lg:w-3/5 space-y-4">
              {restaurants.length > 0 ? (
                restaurants.map((restaurant, index) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-[1.01]">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-grow min-w-0">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg p-2 flex-shrink-0">
                                <Utensils className="w-5 h-5" />
                              </div>
                              <div className="flex-grow min-w-0">
                                <h3 className="text-xl text-gray-800 mb-1 truncate">{restaurant.name}</h3>
                                <Badge className="bg-orange-100 text-orange-700 border-none text-xs">
                                  {restaurant.category}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600 mb-3">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 flex-shrink-0 text-orange-500 mt-0.5" />
                                <span className="break-words">{restaurant.address}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 flex-shrink-0 text-orange-500" />
                                <span>{restaurant.phone || '전화번호 정보 없음'}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <a href={restaurant.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-colors"
                                >
                                  상세보기
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </Button>
                              </a>
                              <Button
                                onClick={() => handleFavorite(restaurant)}
                                variant="outline"
                                size="sm"
                                className={`transition-all duration-300 ${
                                  favorites.has(restaurant.id)
                                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600'
                                    : 'hover:bg-red-50 hover:text-red-500 hover:border-red-300'
                                }`}
                              >
                                <Heart 
                                  className={`w-4 h-4 ${favorites.has(restaurant.id) ? 'fill-white' : ''}`}
                                />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                    <CardContent className="p-8 text-center text-gray-600">
                      <div className="mb-4">
                        <UtensilsCrossed className="w-16 h-16 mx-auto text-gray-400" />
                      </div>
                      <p className="text-xl mb-2">추천할 맛집을 찾지 못했어요 😥</p>
                      <p className="text-gray-500">다른 조건으로 다시 검색해보세요!</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* CSS 애니메이션 */}
        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  return null;
}

export default QuizPage;