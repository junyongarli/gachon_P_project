import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
<<<<<<< HEAD
import { MapPin, ExternalLink, Heart, Utensils, Sparkles, ChefHat, UtensilsCrossed, Loader2, Star, ImageIcon, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
=======
import { MapPin, Phone, ExternalLink, Heart, Utensils, Sparkles, ChefHat, UtensilsCrossed, Star, ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
>>>>>>> 8fd85501699964df7bfc7489be7ca3340454d08f

// [기본 질문] AI 호출 실패 시 사용할 백업 질문
const FALLBACK_QUESTIONS = [
  { 
    id: 1, 
    question: "어떤 맛을 선호하시나요?", 
    options: [
      { text: "매콤한 음식", value: "spicy" }, 
      { text: "담백/순한 음식", value: "mild" }
    ] 
  },
  { 
    id: 2, 
    question: "오늘의 국물 취향은?", 
    options: [
      { text: "따뜻한 국물", value: "hot" }, 
      { text: "시원한 음식", value: "cold" }
    ] 
  },
  { 
    id: 3, 
    question: "주재료는 무엇이 좋을까요?", 
    options: [
      { text: "고기 파티!", value: "meat" }, 
      { text: "신선한 해산물", value: "seafood" }
    ] 
  },
  { 
    id: 4, 
    question: "누구와 함께 하시나요?", 
    options: [
      { text: "혼자만의 시간", value: "alone" }, 
      { text: "친구/연인/그룹", value: "group" }
    ] 
  },
  { 
    id: 5, 
    question: "어떤 분위기를 원하세요?", 
    options: [
      { text: "이국적이고 힙한", value: "western" }, 
      { text: "편안한 한식/전통", value: "korean" }
    ] 
  }
];

const GoogleMap = ({ restaurants, userLocation }) => {
  useEffect(() => {
<<<<<<< HEAD
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
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
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: initialCenter, zoom: 14, disableDefaultUI: false, zoomControl: true,
      });
      setMap(newMap);
    }
  }, [userLocation]);

  useEffect(() => {
    if (!map || !restaurants || restaurants.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    const infowindow = new window.google.maps.InfoWindow({ maxWidth: 240 });
    
    restaurants.forEach((place) => {
      const location = place.geometry?.location;
      if (location) {
        const marker = new window.google.maps.Marker({
          position: location, map: map, title: place.name, animation: window.google.maps.Animation.DROP
        });
        marker.addListener('click', () => {
          // ReviewPage와 동일한 방식으로 이미지 URL 사용 (JavaScript API 객체)
          const photoUrl = place.photos && place.photos.length > 0 
            ? place.photos[0].getUrl({ maxWidth: 400 }) 
            : null;

          const rating = place.rating || 0;
          const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
          const address = place.formatted_address || place.vicinity;
          const mapUrl = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;
          const content = `
            <div style="padding:0; min-width:200px; font-family:sans-serif;">
              ${photoUrl ? `<div style="width:100%; height:120px; background-image:url('${photoUrl}'); background-size:cover; background-position:center; border-radius:6px 6px 0 0; margin-bottom:8px; cursor:pointer;" onclick="window.open('${mapUrl}','_blank')"></div>` : ''}
              <div style="padding:${photoUrl ? '0 5px 5px' : '5px'};">
                <h3 style="margin:0 0 4px; font-size:16px; font-weight:bold;">${place.name}</h3>
                <div style="display:flex; align-items:center; margin-bottom:6px;">
                    <span style="color:#f59e0b; margin-right:4px;">${stars}</span>
                    <span style="color:#666; font-size:12px;">${rating}</span>
                    <span style="color:#999; font-size:11px; margin-left:4px;">(${place.user_ratings_total || 0})</span>
                </div>
                <p style="margin:0; font-size:12px; color:#555;">${address}</p>
              </div>
            </div>
          `;
          infowindow.setContent(content);
          infowindow.open(map, marker);
        });
        bounds.extend(location);
      }
    });
    map.fitBounds(bounds);
  }, [map, restaurants]);
=======
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
          : { lat: 37.566826, lng: 126.9786567 }; // 서울 청
        
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
>>>>>>> 8fd85501699964df7bfc7489be7ca3340454d08f

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
  const [questions, setQuestions] = useState(FALLBACK_QUESTIONS); 
  const [answers, setAnswers] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
<<<<<<< HEAD
  const [favorites, setFavorites] = useState(new Set());

  // 1. 찜 목록 동기화
  useEffect(() => {
    const fetchMyFavorites = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/favorites', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await response.json();
        if (data.success) {
          const myFavoriteIds = new Set(data.favorites.map(fav => fav.restaurant_id));
          setFavorites(myFavoriteIds);
        }
      } catch (error) { console.error(error); }
    };
    fetchMyFavorites();
  }, [token]);
  
  const renderStars = (rating) => (
    <div className="flex items-center">
        <span className="font-bold text-yellow-500 mr-1 text-sm">{rating}</span>
        <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}</div>
    </div>
  );

  const handleFavorite = async (place) => {
    if (!token) return alert("로그인이 필요합니다.");
    
    const restaurantData = {
        id: place.place_id,
        name: place.name,
        category: place.types ? place.types[0].replace(/_/g, ' ') : '식당',
        address: place.formatted_address || place.vicinity,
        phone: '', 
        url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        rating: place.rating || 0,
        user_ratings_total: place.user_ratings_total || 0
    };
=======
  const [favorites, setFavorites] = useState(new Set()); // 찜한 레스토랑 ID 저장
  const [isProcessing, setIsProcessing] = useState(false); // 찜하기 처리 중 상태
  
  const handleFavorite = async (restaurant) => {
    // 로그인 안한 상태에서 찜하기 시도 시
    if (!token) {
      alert("찜하기 기능은 로그인이 필요합니다.");
      return;
    }
>>>>>>> 8fd85501699964df7bfc7489be7ca3340454d08f

    // 찜 상태 토글
    const newFavorites = new Set(favorites);
<<<<<<< HEAD
    const isAdding = !favorites.has(restaurantData.id);

    if (isAdding) newFavorites.add(restaurantData.id);
    else newFavorites.delete(restaurantData.id);
=======
    if (newFavorites.has(restaurant.id)) {
      newFavorites.delete(restaurant.id);
    } else {
      newFavorites.add(restaurant.id);
    }
>>>>>>> 8fd85501699964df7bfc7489be7ca3340454d08f
    setFavorites(newFavorites);

    // 로그인한 상태에서 찜하기
    try {
<<<<<<< HEAD
      if (isAdding) {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            restaurant_id: restaurantData.id,
            restaurant_name: restaurantData.name,
            category: restaurantData.category,
            address: restaurantData.address,
            phone: restaurantData.phone,
            url: restaurantData.url,
            rating: restaurantData.rating,
            user_ratings_total: restaurantData.user_ratings_total
          }),
        });
        if (!response.ok && response.status !== 409) throw new Error('찜하기 실패');
      } else {
        const response = await fetch(`/api/favorites/restaurant/${restaurantData.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('삭제 실패');
      }
    } catch (error) {
      console.error(error);
      alert('오류 발생');
      if (isAdding) newFavorites.delete(restaurantData.id);
      else newFavorites.add(restaurantData.id);
      setFavorites(new Set(newFavorites));
=======
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
>>>>>>> 8fd85501699964df7bfc7489be7ca3340454d08f
    }
  };

  // 2. 시작하기 버튼 클릭 시 -> AI 질문 생성 요청
  const handleStart = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
            const location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
            setUserLocation(location);
            generateAiQuestions(location); 
        },
<<<<<<< HEAD
        () => {
            console.log("위치 정보 거부됨");
            generateAiQuestions(null); 
=======
        (error) => {
          setCurrentStep('questions');
>>>>>>> 8fd85501699964df7bfc7489be7ca3340454d08f
        }
      );
    } else {
        generateAiQuestions(null);
    }
  };

  // 3. AI 질문 생성 함수 (수정됨: Body 내용 채움)
  const generateAiQuestions = async (locationData) => {
    if (!token) {
        // 로그인 안했으면 바로 기본 질문 사용
        setCurrentStep('questions');
        return;
    }

    setCurrentStep('ai_loading');

    try {
        const response = await fetch('/api/ai/quiz/generate', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            // [수정됨] 실제 데이터를 전송하도록 수정
            body: JSON.stringify({
                location: locationData ? `${locationData.latitude}, ${locationData.longitude}` : '서울',
                time: new Date().toLocaleTimeString(),
                weather: '맑음' 
            })
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            let aiQuestions = data.data; 
            
            // 부족하면 기본 질문으로 채움
            if (aiQuestions.length < 5) {
                const missingCount = 5 - aiQuestions.length;
                const padQuestions = FALLBACK_QUESTIONS.slice(0, missingCount).map(q => ({
                    question: q.question,
                    options: q.options
                }));
                aiQuestions = [...aiQuestions, ...padQuestions];
            }

            // ID 재할당
            const finalQuestions = aiQuestions.map((q, idx) => ({
                id: idx + 1,
                question: q.question || "질문 내용 없음",
                options: q.options
            }));
            setQuestions(finalQuestions);
        } else {
            setQuestions(FALLBACK_QUESTIONS);
        }
    } catch (error) {
        console.error("AI API Error:", error);
        setQuestions(FALLBACK_QUESTIONS);
    } finally {
        setCurrentQuestionIndex(0);
        setCurrentStep('questions');
    }
  };

  const handleAnswer = (qid, ans) => {
    const newAnswers = { ...answers, [qid]: ans.value };
    setAnswers(newAnswers);
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
    else searchRestaurants(newAnswers);
  };

  const searchRestaurants = async (userAnswers) => {
    setCurrentStep('loading'); // 로딩 화면 다시 활성화
    try {
      const response = await fetch('/api/restaurant/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: Object.values(userAnswers) })
      });
      const data = await response.json();
      
      if (data.success && data.query) {
        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        
        const request = {
            query: data.query,
            type: 'restaurant'
        };
        
        if (userLocation) {
            request.location = new window.google.maps.LatLng(userLocation.latitude, userLocation.longitude);
            // 구글 검색 자체는 좀 넓게 잡아둡니다 (필터링으로 거를 것이므로)
        }

        service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                
                const allowedTypes = ['restaurant', 'food', 'cafe', 'bakery', 'bar', 'meal_takeaway', 'meal_delivery'];
                
                // [핵심] 백엔드에서 받은 radius 값 사용 (없으면 기본 50km)
                const limitRadius = data.radius || 50000; 

                const filtered = results.filter(place => {
                    const isRestaurant = place.types && place.types.some(t => allowedTypes.includes(t));
                    if (!isRestaurant) return false;

                    if (userLocation && place.geometry && place.geometry.location) {
                        const myPos = new window.google.maps.LatLng(userLocation.latitude, userLocation.longitude);
                        const placePos = place.geometry.location;
                        const distanceInMeters = window.google.maps.geometry.spherical.computeDistanceBetween(myPos, placePos);
                        
                        // [수정] 백엔드가 정해준 거리보다 멀면 탈락!
                        if (distanceInMeters > limitRadius) { 
                            return false; 
                        }

                        place.distanceText = (distanceInMeters / 1000).toFixed(1) + "km";
                        place.distanceVal = distanceInMeters;
                    }
                    return true;
                });

                filtered.sort((a, b) => (a.distanceVal || 0) - (b.distanceVal || 0));

                if (filtered.length === 0) {
                    // 너무 좁혀서 결과가 없으면 원본에서 가까운 순으로 5개만
                    setRestaurants(results.slice(0, 5)); 
                } else {
                    setRestaurants(filtered);
                }
            } else {
                setRestaurants([]);
            }
            setCurrentStep('results');
        });
      }
    } catch (error) {
      setRestaurants([]);
      setCurrentStep('results');
    }
  };

  const resetQuiz = () => {
    setCurrentStep('start');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setRestaurants([]);
    setQuestions(FALLBACK_QUESTIONS); 
  };

<<<<<<< HEAD
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
=======
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
>>>>>>> 8fd85501699964df7bfc7489be7ca3340454d08f
              </div>
            </motion.div>
            <Card className="bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" /> AI 맛집 추천 <Sparkles className="w-6 h-6 text-yellow-500" />
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  당신의 취향과 찜 목록을 분석하여<br />딱 맞는 질문을 생성합니다!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleStart} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg py-6 text-lg">
                  <Utensils className="w-5 h-5 mr-2" /> 퀴즈 시작하기
                </Button>
              </CardContent>
            </Card>
          </motion.div>
<<<<<<< HEAD
        </div>
    );
  }

  if (currentStep === 'ai_loading') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-center flex flex-col items-center p-6">
          <div className="bg-white p-4 rounded-full shadow-lg mb-6 relative">
             <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
             <BrainCircuit className="w-12 h-12 text-indigo-600 relative z-10" />
          </div>
          <h2 className="text-2xl text-indigo-900 font-bold mb-2">AI가 질문을 생성 중입니다</h2>
          <p className="text-indigo-600">사용자님의 취향을 분석하고 있어요...</p>
=======

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
>>>>>>> 8fd85501699964df7bfc7489be7ca3340454d08f
        </motion.div>
      </div>
    );
  }

  // QUESTIONS 화면
  if (currentStep === 'questions') {
    const currentQuestion = questions[currentQuestionIndex];
    
    // 안전장치: 질문 데이터가 없을 경우
    if (!currentQuestion) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">질문을 불러오는 중 오류가 발생했습니다.</p>
                    <Button onClick={resetQuiz}>처음으로 돌아가기</Button>
                </div>
            </div>
        );
    }

    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* 그라데이션 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
        
        {/* 배경 장식 요소 */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
<<<<<<< HEAD
        <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
=======
        <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
>>>>>>> 8fd85501699964df7bfc7489be7ca3340454d08f

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
<<<<<<< HEAD
          <AnimatePresence mode="wait">
            <motion.div key={currentQuestion.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-3xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl text-gray-800 mb-6 font-bold leading-tight">{currentQuestion.question}</h2>
                <p className="text-xl text-gray-600">가장 끌리는 선택지는?</p>
              </div>
              <div className="space-y-5">
                {currentQuestion.options && currentQuestion.options.map((option, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                    <Button variant="outline" className="w-full h-auto py-8 px-10 text-xl md:text-2xl bg-white/90 border-2 hover:border-orange-500 hover:bg-orange-50 rounded-2xl shadow-md transition-all duration-200" onClick={() => handleAnswer(currentQuestion.id, option)}>
                      <span className="text-gray-800">{option.text}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
=======
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
>>>>>>> 8fd85501699964df7bfc7489be7ca3340454d08f
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
                <div className="flex flex-wrap gap-2 items-center">
                  {questions.map((question) => {
                    const selectedValue = answers[question.id];
                    const selectedOption = question.options.find(opt => opt.value === selectedValue);
                    
                    return selectedOption ? (
                      <Badge key={question.id} className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200 text-xs">
                        {selectedOption.text}
                      </Badge>
                    ) : null;
                  })}
                </div>
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
<<<<<<< HEAD
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-2/5 lg:sticky lg:top-6">
=======
            
            {/* 왼쪽: 지도 (고정) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full lg:w-2/5 lg:sticky lg:top-6"
            >
>>>>>>> 8fd85501699964df7bfc7489be7ca3340454d08f
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

<<<<<<< HEAD
=======
            {/* 오른쪽: 레스토랑 목록 (스크롤) */}
>>>>>>> 8fd85501699964df7bfc7489be7ca3340454d08f
            <div className="w-full lg:w-3/5 space-y-4">
              {restaurants.length > 0 ? (
                restaurants.map((restaurant, index) => {
                  const photoUrl = restaurant.photos && restaurant.photos.length > 0 
                    ? restaurant.photos[0].getUrl({ maxWidth: 400 })
                    : null;

                  return (
<<<<<<< HEAD
                    <motion.div key={restaurant.place_id || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                      <Card className="overflow-hidden border-none bg-white/90 hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-row h-32 md:h-40">
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
                                        {restaurant.types ? restaurant.types[0] : '식당'}
                                    </Badge>
                                </div>
                            </div>
                            
                            <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1 mb-1">{restaurant.name}</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        {renderStars(restaurant.rating)}
                                        <span className="text-xs text-gray-500">({restaurant.user_ratings_total?.toLocaleString()})</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                        <span className="line-clamp-1 text-xs md:text-sm">{restaurant.formatted_address}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <a href={`https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                                        <Button size="sm" variant="outline" className="w-full h-8 text-xs hover:bg-orange-50 hover:text-orange-600 border-orange-200">
                                            지도 보기 <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
                                        </Button>
                                    </a>
                                    <Button size="sm" variant="outline" onClick={() => handleFavorite(restaurant)} className={`h-8 px-3 transition-colors ${favorites.has(restaurant.place_id) ? 'bg-red-50 text-red-500 border-red-200' : 'hover:bg-gray-50 text-gray-500 border-gray-200'}`}>
                                        <Heart className={`w-4 h-4 ${favorites.has(restaurant.place_id) ? 'fill-red-500 text-red-500' : ''}`} />
                                    </Button>
=======
                    <motion.div
                      key={restaurant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                    >
                      <Card className="overflow-hidden border-none bg-white/90 hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
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
                              <h3 className="text-lg line-clamp-1 mb-1 text-gray-800">{restaurant.name}</h3>
                              {restaurant.rating && (
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center">
                                    <span className="text-yellow-500 mr-1 text-sm">★</span>
                                    <span className="text-sm text-gray-700">{restaurant.rating.toFixed(1)}</span>
                                  </div>
                                  {restaurant.user_ratings_total && (
                                    <span className="text-xs text-gray-500">({restaurant.user_ratings_total.toLocaleString()})</span>
                                  )}
>>>>>>> 8fd85501699964df7bfc7489be7ca3340454d08f
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                                <span className="line-clamp-1 text-xs md:text-sm">{restaurant.address}</span>
                              </div>
                              {restaurant.distance && (
                                <div className="inline-block bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded">{restaurant.distance}</div>
                              )}
                            </div>
                            <div className="flex gap-2 mt-2">
                              <a href={restaurant.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full h-8 text-xs hover:bg-orange-50 hover:text-orange-600 border-orange-200"
                                >
                                  지도 보기 <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
                                </Button>
                              </a>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleFavorite(restaurant)}
                                className={`h-8 px-3 transition-colors ${
                                  favorites.has(restaurant.id)
                                    ? 'bg-red-50 text-red-500 border-red-200'
                                    : 'hover:bg-gray-50 text-gray-500 border-gray-200'
                                }`}
                              >
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