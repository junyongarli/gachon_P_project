import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Heart, Utensils, Sparkles, ChefHat, UtensilsCrossed, Loader2, Star, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

// --- [지도 컴포넌트] ---
const GoogleMapComponent = ({ restaurants, userLocation }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current) return;

      const initialCenter = userLocation
        ? { lat: userLocation.latitude, lng: userLocation.longitude }
        : { lat: 37.5665, lng: 126.9780 };

      const mapOptions = {
        center: initialCenter,
        zoom: 14,
        disableDefaultUI: false,
        zoomControl: true,
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
    }
  }, [userLocation]);

  useEffect(() => {
    if (!map || !restaurants || restaurants.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    const infowindow = new window.google.maps.InfoWindow({
        maxWidth: 240, 
    });
    
    restaurants.forEach((restaurant) => {
      if (restaurant.y && restaurant.x) {
        const position = { lat: parseFloat(restaurant.y), lng: parseFloat(restaurant.x) };
        
        const marker = new window.google.maps.Marker({
          position: position,
          map: map,
          title: restaurant.name,
          animation: window.google.maps.Animation.DROP
        });

        marker.addListener('click', () => {
          const photoUrl = restaurant.photo_reference 
            ? `/api/restaurant/image/${restaurant.photo_reference}` 
            : null;

          const rating = restaurant.rating || 0;
          const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

          const content = `
            <div style="padding: 0; min-width: 200px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
              ${photoUrl ? `
                <div style="
                  width: 100%; 
                  height: 120px; 
                  background-image: url('${photoUrl}'); 
                  background-size: cover; 
                  background-position: center; 
                  border-radius: 6px 6px 0 0;
                  margin-bottom: 8px;
                  cursor: pointer;
                " onclick="window.open('${restaurant.url}', '_blank')"></div>
              ` : ''}
              <div style="padding: ${photoUrl ? '0 5px 5px 5px' : '5px'};">
                <h3 style="margin: 0 0 4px; font-size: 16px; font-weight: bold; line-height: 1.2;">
                  <a href="${restaurant.url}" target="_blank" style="color: #1a1a1a; text-decoration: none; cursor: pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
                    ${restaurant.name}
                  </a>
                </h3>
                
                <div style="display: flex; align-items: center; margin-bottom: 6px;">
                    <span style="color: #f59e0b; margin-right: 4px; font-size: 14px;">${stars}</span>
                    <span style="color: #666; font-size: 12px; font-weight: 500;">${rating.toFixed(1)}</span>
                    <span style="color: #999; font-size: 11px; margin-left: 4px;">(${restaurant.user_ratings_total || 0})</span>
                </div>

                <div style="margin-bottom: 4px;">
                   <span style="background-color: #fff7ed; color: #c2410c; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                     ${restaurant.category}
                   </span>
                </div>

                <p style="margin: 0; font-size: 12px; color: #555; line-height: 1.4;">
                  ${restaurant.address}
                </p>
              </div>
            </div>
          `;
          
          infowindow.setContent(content);
          infowindow.open(map, marker);
        });

        bounds.extend(position);
      }
    });

    map.fitBounds(bounds);
  }, [map, restaurants]);

  return <div ref={mapRef} className="w-full rounded-xl shadow-inner" style={{ height: '500px' }}></div>;
};

// --- [메인 페이지] ---
function QuizPage() {
  const { token } = useAuth();
  
  const [currentStep, setCurrentStep] = useState('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [favorites, setFavorites] = useState(new Set()); // restaurant_id 저장용 Set

  // 1. 처음 페이지 들어올 때 내 찜 목록 가져와서 하트 채워두기
  useEffect(() => {
    const fetchMyFavorites = async () => {
      if (!token) return;

      try {
        const response = await fetch('/api/favorites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
          // restaurant_id만 모아서 Set으로 만듦
          const myFavoriteIds = new Set(data.favorites.map(fav => fav.restaurant_id));
          setFavorites(myFavoriteIds);
        }
      } catch (error) {
        console.error("찜 목록 동기화 실패:", error);
      }
    };

    fetchMyFavorites();
  }, [token]);
  
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        <span className="font-bold text-yellow-500 mr-1 text-sm">{rating}</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>
    );
  };

  // 2. 하트 클릭 핸들러 (토글 기능 구현)
  const handleFavorite = async (restaurant) => {
    if (!token) {
      alert("찜하기 기능은 로그인이 필요합니다.");
      return;
    }

    const newFavorites = new Set(favorites);
    const isAdding = !favorites.has(restaurant.id); // 현재 없으면 추가(true), 있으면 삭제(false)

    // 낙관적 업데이트 (화면 먼저 반영)
    if (isAdding) {
      newFavorites.add(restaurant.id);
    } else {
      newFavorites.delete(restaurant.id);
    }
    setFavorites(newFavorites);

    try {
      if (isAdding) {
        // [추가] 찜하기 요청
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
            phone: '', 
            url: restaurant.url,
            rating: restaurant.rating,
            user_ratings_total: restaurant.user_ratings_total
          }),
        });
        
        // 이미 찜한 경우(409)는 에러 아님
        if (!response.ok && response.status !== 409) {
            throw new Error('찜하기 실패');
        }
        
        if (response.status === 201) {
            // alert(`${restaurant.name} 식당이 찜목록에 저장되었습니다.`); // 너무 자주 뜨면 귀찮으므로 주석 처리 가능
        }
      } else {
        // [삭제] 찜 해제 요청 (새로 만든 API 호출)
        const response = await fetch(`/api/favorites/restaurant/${restaurant.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('삭제 실패');
        }
      }

    } catch (error) {
      console.error(error);
      alert('작업 중 오류가 발생했습니다.');
      // 실패 시 롤백 (원래대로 되돌림)
      if (isAdding) {
          newFavorites.delete(restaurant.id);
      } else {
          newFavorites.add(restaurant.id);
      }
      setFavorites(new Set(newFavorites));
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
        (error) => setCurrentStep('questions')
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
    setCurrentStep('loading');
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
      console.error(error);
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

  // --- 화면 렌더링 ---

  if (currentStep === 'start') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-white p-6 rounded-full shadow-xl">
                <ChefHat className="w-16 h-16 text-orange-500" />
              </div>
            </div>
          </motion.div>
          <Card className="bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" /> 맛집 추천 AI <Sparkles className="w-6 h-6 text-yellow-500" />
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">몇 가지 질문에 답하시면<br />취향저격 맛집을 찾아드려요!</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleStart} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg py-6 text-lg">
                <Utensils className="w-5 h-5 mr-2" /> 시작하기
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (currentStep === 'questions') {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 p-2 rounded-lg"><UtensilsCrossed className="w-6 h-6 text-white" /></div>
                <div><p className="text-sm text-gray-600">질문</p><p className="font-bold text-gray-800">{currentQuestionIndex + 1} / {questions.length}</p></div>
              </div>
              {currentQuestionIndex > 0 && <Button variant="ghost" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>이전 질문</Button>}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full shadow-md"></motion.div>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-140px)] p-6">
          <AnimatePresence mode="wait">
            <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-3xl">
              <div className="text-center mb-12">
                <h2 className="text-5xl text-gray-800 mb-4 font-bold">{currentQuestion.question}</h2>
                <p className="text-xl text-gray-600">선택지를 눌러주세요</p>
              </div>
              <div className="space-y-5">
                {currentQuestion.options.map((option, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                    <Button variant="outline" className="w-full h-auto py-8 px-10 text-2xl bg-white/90 border-2 hover:border-orange-500 hover:bg-orange-50 rounded-2xl shadow-md" onClick={() => handleAnswer(currentQuestion.id, option)}>
                      <span className="text-gray-800">{option.text}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-center flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
          <h2 className="text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold">맛집을 찾는 중...</h2>
        </motion.div>
      </div>
    );
  }

  if (currentStep === 'results') {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gray-50">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <h2 className="text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold">추천 맛집</h2>
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
            <Button onClick={resetQuiz} variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
              <Utensils className="w-4 h-4 mr-2" /> 다시 검색하기
            </Button>
          </div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* 왼쪽: 지도 (고정) */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-2/5 lg:sticky lg:top-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-800 flex items-center gap-2 font-bold"><MapPin className="w-5 h-5 text-orange-500" /> 지도</h3>
                  <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white border-none">{restaurants.length}개 발견</Badge>
                </div>
                <GoogleMapComponent restaurants={restaurants} userLocation={userLocation} />
              </div>
            </motion.div>

            {/* 오른쪽: 레스토랑 목록 */}
            <div className="w-full lg:w-3/5 space-y-4">
              {restaurants.length > 0 ? (
                restaurants.map((restaurant, index) => {
                  const photoUrl = restaurant.photo_reference 
                    ? `/api/restaurant/image/${restaurant.photo_reference}`
                    : null;

                  return (
                    <motion.div key={restaurant.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                      <Card className="overflow-hidden border-none bg-white/90 hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-row h-32 md:h-40">
                            {/* 왼쪽: 이미지 */}
                            <div className="w-32 md:w-40 shrink-0 relative bg-gray-100">
                                {photoUrl ? (
                                    <img src={photoUrl} alt={restaurant.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1">
                                        <ImageIcon className="w-6 h-6" />
                                        <span className="text-[10px]">이미지 없음</span>
                                    </div>
                                )}
                                <div className="absolute top-2 left-2">
                                    <Badge className="bg-white/90 text-orange-600 hover:bg-white shadow-sm border-none text-[10px] px-1.5 py-0.5">
                                        {restaurant.category}
                                    </Badge>
                                </div>
                            </div>
                            
                            {/* 오른쪽: 정보 */}
                            <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1 mb-1">{restaurant.name}</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        {renderStars(restaurant.rating)}
                                        <span className="text-xs text-gray-500">({restaurant.user_ratings_total?.toLocaleString()})</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                        <span className="line-clamp-1 text-xs md:text-sm">{restaurant.address}</span>
                                    </div>
                                    {restaurant.distance && (
                                        <div className="inline-block bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-medium">{restaurant.distance}</div>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <a href={restaurant.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                                        <Button size="sm" variant="outline" className="w-full h-8 text-xs hover:bg-orange-50 hover:text-orange-600 border-orange-200">
                                            지도 보기 <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
                                        </Button>
                                    </a>
                                    <Button size="sm" variant="outline" onClick={() => handleFavorite(restaurant)} className={`h-8 px-3 transition-colors ${favorites.has(restaurant.id) ? 'bg-red-50 text-red-500 border-red-200' : 'hover:bg-gray-50 text-gray-500 border-gray-200'}`}>
                                        <Heart className={`w-4 h-4 ${favorites.has(restaurant.id) ? 'fill-red-500 text-red-500' : ''}`} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                    <CardContent className="p-8 text-center text-gray-600">
                      <div className="mb-4"><UtensilsCrossed className="w-16 h-16 mx-auto text-gray-400" /></div>
                      <p className="text-xl mb-2 font-medium">추천할 맛집을 찾지 못했어요 😥</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes blob { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
      </div>
    );
  }

  return null;
}

export default QuizPage;