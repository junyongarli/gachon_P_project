import { useState, useEffect, useRef } from 'react';
// 상대 경로 사용 (.jsx 명시)
import { Card, CardContent } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Button } from '../components/ui/button.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { 
  Search, MapPin, Phone, ExternalLink, Heart, Star, Navigation, Clock, 
  Send, Bot, User as UserIcon, Sparkles, ImageIcon, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';

// [유틸리티] 한글 받침에 따라 조사 선택 (은/는, 이/가, 을/를)
const getJosa = (word, type) => {
    if (!word) return '';
    const lastChar = word.charCodeAt(word.length - 1);
    const hasJongseong = (lastChar - 0xAC00) % 28 > 0;

    if (type === '은/는') return hasJongseong ? '은' : '는';
    if (type === '이/가') return hasJongseong ? '이' : '가';
    if (type === '을/를') return hasJongseong ? '을' : '를';
    return '';
};

function SmartSearchPage() {
  const { user, token } = useAuth();
  
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const chatEndRef = useRef(null);
  
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // 1. Google Maps API 로드 및 위치 설정
  useEffect(() => {
    const apiKey = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY || '';
    
    if (window.google && window.google.maps) {
      setIsApiLoaded(true);
    } else if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsApiLoaded(true);
        document.head.appendChild(script);
    } else {
        setIsApiLoaded(true);
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                console.log("📍 GPS 위치 확보 성공:", pos.coords.latitude, pos.coords.longitude);
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            (err) => {
                console.warn("⚠️ GPS 위치 확보 실패 (권한 거부/HTTP):", err);
                const defaultLoc = { lat: 37.4508, lng: 127.1288 }; 
                setUserLocation(defaultLoc);
                console.log("📍 기본 위치(가천대)로 설정됨");
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
    } else {
        const defaultLoc = { lat: 37.4508, lng: 127.1288 }; 
        setUserLocation(defaultLoc);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAIThinking]);

  // 2. 메시지 전송 및 AI 처리
  const handleSendMessage = async (text = null) => {
    const messageToSend = text || userInput;
    if (!messageToSend.trim()) return;

    const newUserMsg = { id: Date.now(), role: 'user', content: messageToSend };
    const currentHistory = [...chatMessages, newUserMsg];
    
    setChatMessages(currentHistory);
    setUserInput('');
    setIsAIThinking(true);

    try {
        const response = await fetch('/api/ai/smart-search', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ 
                message: messageToSend,
                history: currentHistory.map(m => ({ role: m.role, content: m.content })),
                userLocation 
            })
        });
        const data = await response.json();

        if (data.success) {
            let searchResults = [];
            let finalAiMessage = data.aiMessage || "결과를 확인해보세요.";

            // [디버깅] AI가 준 원본 메시지 확인
            console.log("🤖 AI 원본 응답:", finalAiMessage);
            console.log("🔍 검색어:", data.searchQuery);

            if (data.searchQuery && isApiLoaded && window.google) {
                searchResults = await performGoogleSearch(data.searchQuery, data.searchType);
                console.log("📍 구글 검색 결과 수:", searchResults.length);
                
                if (searchResults && searchResults.length > 0) {
                    const topPlaceName = searchResults[0].name; // 1순위 가게 이름
                    console.log("🏆 1순위 가게:", topPlaceName);

                    // 1. '#@소속#은(는)', '#@소속#이(가)' 처럼 괄호가 포함된 패턴을 먼저 처리
                    finalAiMessage = finalAiMessage.replace(/#@소속#(\s*[\(]?[은는][\)]?)/g, `'${topPlaceName}'${getJosa(topPlaceName, '은/는')}`);
                    finalAiMessage = finalAiMessage.replace(/#@소속#(\s*[\(]?[이가][\)]?)/g, `'${topPlaceName}'${getJosa(topPlaceName, '이/가')}`);
                    
                    // 2. 조사가 없는 나머지 '#@소속#' 태그 처리
                    finalAiMessage = finalAiMessage.replace(/#@소속#/g, `'${topPlaceName}'`);

                } else {
                    console.log("⚠️ 검색 결과 없음 -> 대체 텍스트 사용");
                    finalAiMessage = finalAiMessage.replace(/#@소속#(\s*[\(]?[은는이가][\)]?)/g, "이곳");
                    finalAiMessage = finalAiMessage.replace(/#@소속#/g, "이 주변 맛집");
                }
            } else {
                finalAiMessage = finalAiMessage.replace(/#@소속#(\s*[\(]?[은는이가][\)]?)/g, "추천 장소");
                finalAiMessage = finalAiMessage.replace(/#@소속#/g, "추천 장소");
            }

            console.log("✅ 최종 출력 메시지:", finalAiMessage);

            const newAiMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: finalAiMessage,
                restaurants: searchResults
            };
            setChatMessages(prev => [...prev, newAiMsg]);
        } else {
            throw new Error("AI 응답 실패");
        }

    } catch (error) {
        console.error(error);
        setChatMessages(prev => [...prev, {
            id: Date.now() + 1,
            role: 'assistant',
            content: "죄송합니다. 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        }]);
    } finally {
        setIsAIThinking(false);
    }
  };

  // 3. 구글 검색 실행 (좌표 추출 추가됨)
  const performGoogleSearch = (query, searchType) => {
    return new Promise((resolve) => {
        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        
        const request = { query: query };
        let limitRadius = null; 

        if (searchType === 'CURRENT_LOCATION' && userLocation) {
            request.location = new window.google.maps.LatLng(userLocation.lat, userLocation.lng);
            request.radius = 2000; 
            limitRadius = 2000;
            console.log("📍 내 주변 2km 검색 모드");
        } else {
            console.log(`📍 지역/키워드 검색 모드: "${query}"`);
        }

        service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                const allowedTypes = ['restaurant', 'food', 'cafe', 'bakery', 'bar', 'meal_takeaway'];
                
                let filtered = results.filter(place => 
                    place.types && place.types.some(t => allowedTypes.includes(t))
                );

                if (limitRadius && userLocation) {
                    const filteredByDistance = filtered.filter(place => {
                        if (!place.geometry) return false;
                        const myPos = new window.google.maps.LatLng(userLocation.lat, userLocation.lng);
                        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(myPos, place.geometry.location);
                        
                        place.distanceText = (distance / 1000).toFixed(1) + "km";
                        place.distanceVal = distance;
                        
                        return distance <= limitRadius;
                    });

                    if (filteredByDistance.length > 0) {
                        filtered = filteredByDistance;
                        filtered.sort((a, b) => (a.distanceVal || 0) - (b.distanceVal || 0));
                    } else {
                        console.warn("⚠️ 거리 필터로 결과 0개 -> 원본 결과 표시");
                    }
                }
                
                const formatted = filtered.slice(0, 5).map(place => ({
                    id: place.place_id,
                    name: place.name,
                    category: place.types ? place.types[0].replace(/_/g, ' ') : '식당',
                    address: place.formatted_address,
                    rating: place.rating,
                    user_ratings_total: place.user_ratings_total,
                    photoUrl: place.photos && place.photos.length > 0 
                        ? place.photos[0].getUrl({ maxWidth: 400 }) 
                        : null,
                    url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`,
                    distanceText: place.distanceText || null,
                    
                    // [핵심 추가] 좌표 정보 저장 (찜하기용)
                    location: place.geometry ? {
                        lat: place.geometry.location.lat(), 
                        lng: place.geometry.location.lng() 
                    } : { lat: 0, lng: 0 }
                }));
                resolve(formatted);
            } else {
                resolve([]);
            }
        });
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-800">AI 스마트 검색</h1>
          </div>
          <p className="text-gray-600">
            "강남역 분위기 좋은 파스타집 찾아줘" 처럼 편하게 말해보세요.
          </p>
        </div>
        
        <Card className="bg-white/80 backdrop-blur-sm h-[70vh] flex flex-col shadow-lg overflow-hidden">
          <CardContent className="p-4 flex-1 flex flex-col h-full">
            
            <div className="flex-1 overflow-y-auto pr-2 mb-4 custom-scrollbar">
              {chatMessages.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>AI에게 맛집 추천을 요청해보세요!</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {["강남역 조용한 카페", "홍대 가성비 맛집", "가족이랑 갈만한 한식당"].map(ex => (
                        <Button key={ex} variant="outline" size="sm" onClick={() => handleSendMessage(ex)}>
                            "{ex}"
                        </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {chatMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600">
                          <Bot className="w-5 h-5" />
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-2xl px-4 shadow-sm text-sm ${
                            msg.role === 'user' 
                            ? 'bg-orange-500 text-white rounded-tr-none' 
                            : 'bg-white border border-gray-100 rounded-tl-none'
                          }`}
                        >
                          {msg.content}
                        </div>

                        {msg.restaurants && msg.restaurants.length > 0 && (
                          <div className="space-y-3 w-full min-w-[300px]">
                            {msg.restaurants.map((place) => (
                              <RestaurantCard key={place.id} place={place} />
                            ))}
                          </div>
                        )}
                      </div>

                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <UserIcon className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isAIThinking && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Bot className="w-5 h-5" /></div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                        </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="메시지를 입력하세요..."
                className="flex-1"
                disabled={isAIThinking}
              />
              <Button 
                onClick={() => handleSendMessage()} 
                disabled={isAIThinking || !userInput.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fb923c;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f97316;
        }
      `}</style>
    </div>
  );
}

function RestaurantCard({ place }) {
    const { user, token } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = async () => {
        if(!token) return alert("로그인이 필요합니다.");
        setIsFavorite(!isFavorite);
        
        try {
             await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    restaurant_id: place.id,
                    restaurant_name: place.name,
                    category: place.category,
                    address: place.address,
                    phone: '',
                    url: place.url,
                    rating: place.rating,
                    user_ratings_total: place.user_ratings_total,
                    
                    // [수정] 0,0 대신 실제 좌표값(lng, lat) 전송
                    x: place.location ? place.location.lng : 0, 
                    y: place.location ? place.location.lat : 0
                })
            });
        } catch(e) {
            console.error(e);
            setIsFavorite(prev => !prev);
        }
    };

    return (
        <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                {place.photoUrl ? (
                    <img src={place.photoUrl} alt={place.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-8 h-8" />
                    </div>
                )}
            </div>
            <div className="flex-1 p-3 min-w-0 flex flex-col justify-between">
                <div>
                    <h4 className="font-bold text-gray-800 truncate">{place.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span>{place.rating || '0.0'}</span>
                        <span className="text-gray-300">|</span>
                        <span className="truncate">{place.category}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 truncate">{place.address}</p>
                    {place.distanceText && (
                        <p className="text-xs text-blue-500 mt-1 font-medium">{place.distanceText}</p>
                    )}
                </div>
                <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={() => window.open(place.url, '_blank')}>
                        지도 <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={toggleFavorite}>
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SmartSearchPage;