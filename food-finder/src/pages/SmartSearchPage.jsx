import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, MapPin, Phone, ExternalLink, Heart, Star, Navigation, Clock, 
  Send, Bot, User as UserIcon, Sparkles, TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';

function SmartSearchPage() {
  const { user, token } = useAuth();
  
  // AI 대화형 검색
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const chatEndRef = useRef(null);
  
  // 현재 위치
  const [userLocation, setUserLocation] = useState(null);
  
  // AI 대화 예시 프롬프트
  const examplePrompts = [
    "현재 위치에서 도보 10분 이내 혼밥하기 좋은 한식당",
    "차로 20분 거리 분위기 좋은 이탈리안 레스토랑",
    "대중교통 30분 이내 반려동물 동반 가능한 카페",
    "걸어서 5분 거리 주차 가능한 일식당",
    "지하철로 갈 수 있는 단체 모임하기 좋은 고깃집"
  ];
  
  // 위치 정보 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('위치 정보를 가져올 수 없습니다.');
        }
      );
    }
  }, []);
  
  // AI 자연어에서 조건 파싱 (Mock)
  const parseNaturalLanguage = (message) => {
    const conditions = {
      transportMode: 'walk',
      maxDistance: 3,
      keywords: []
    };
    
    // 이동수단 파싱
    if (message.includes('도보') || message.includes('걸어서')) {
      conditions.transportMode = 'walk';
    } else if (message.includes('차로') || message.includes('자동차') || message.includes('드라이브')) {
      conditions.transportMode = 'car';
    } else if (message.includes('대중교통') || message.includes('지하철') || message.includes('버스')) {
      conditions.transportMode = 'transit';
    }
    
    // 거리/시간 파싱
    const distanceMatch = message.match(/(\d+)\s*(분|km|키로)/);
    if (distanceMatch) {
      const value = parseInt(distanceMatch[1]);
      if (message.includes('분')) {
        // 시간을 거리로 변환
        const speeds = { walk: 4, car: 30, transit: 20 };
        conditions.maxDistance = (value / 60) * speeds[conditions.transportMode];
      } else {
        conditions.maxDistance = value;
      }
    }
    
    // 키워드 추출
    const keywords = ['혼밥', '분위기', '이탈리안', '한식', '일식', '중식', '양식', 
                      '카페', '반려동물', '주차', '단체', '데이트', '고깃집'];
    keywords.forEach(keyword => {
      if (message.includes(keyword)) {
        conditions.keywords.push(keyword);
      }
    });
    
    return conditions;
  };
  
  // Mock 맛집 데이터 생성
  const generateMockRestaurants = (conditions) => {
    const mockData = [
      {
        id: 1,
        name: '혼밥하기 좋은 김치찌개',
        category: '한식',
        address: '서울시 강남구 역삼동 123',
        latitude: 37.5012,
        longitude: 127.0396,
        phone: '02-1234-5678',
        rating: 4.5,
        distance: 0.8,
        features: ['혼밥', '주차가능', '와이파이'],
        aiReason: '1인석이 많고 빠른 식사가 가능해요. 도보로 약 10분 거리입니다.'
      },
      {
        id: 2,
        name: '라 베니스 이탈리아노',
        category: '양식',
        address: '서울시 강남구 청담동 456',
        latitude: 37.5245,
        longitude: 127.0392,
        phone: '02-2345-6789',
        rating: 4.8,
        distance: 1.2,
        features: ['분위기좋음', '데이트', '주차가능'],
        aiReason: '로맨틱한 분위기와 정통 이탈리안 요리가 일품입니다.'
      },
      {
        id: 3,
        name: '펫프렌들리 카페',
        category: '카페',
        address: '서울시 강남구 선릉로 789',
        latitude: 37.5089,
        longitude: 127.0478,
        phone: '02-3456-7890',
        rating: 4.6,
        distance: 2.1,
        features: ['반려동물동반', '야외테라스', '주차가능'],
        aiReason: '반려동물과 함께 편하게 이용할 수 있는 넓은 공간이 있어요.'
      },
      {
        id: 4,
        name: '스시 장인',
        category: '일식',
        address: '서울시 강남구 논현동 321',
        latitude: 37.5102,
        longitude: 127.0289,
        phone: '02-4567-8901',
        rating: 4.7,
        distance: 0.5,
        features: ['주차가능', '단체석', '예약가능'],
        aiReason: '신선한 회와 정통 초밥을 맛볼 수 있는 곳입니다.'
      },
      {
        id: 5,
        name: '프리미엄 한우 고깃집',
        category: '한식',
        address: '서울시 강남구 삼성동 654',
        latitude: 37.5134,
        longitude: 127.0567,
        phone: '02-5678-9012',
        rating: 4.9,
        distance: 1.8,
        features: ['단체석', '주차가능', '룸', '대중교통'],
        aiReason: '단체 모임에 최적화된 넓은 룸과 주차 공간이 있습니다.'
      }
    ];
    
    // 조건에 맞는 맛집 필터링
    let filtered = mockData;
    
    // 거리 필터
    filtered = filtered.filter(r => r.distance <= conditions.maxDistance);
    
    // 키워드 필터 (키워드가 있으면)
    if (conditions.keywords.length > 0) {
      filtered = filtered.filter(r => {
        return conditions.keywords.some(keyword => 
          r.name.includes(keyword) || 
          r.features.some(f => f.includes(keyword)) ||
          r.category.includes(keyword)
        );
      });
    }
    
    // 이동시간 계산
    const speeds = { walk: 4, car: 30, transit: 20 };
    filtered = filtered.map(r => ({
      ...r,
      transportMode: conditions.transportMode,
      travelTime: Math.round((r.distance / speeds[conditions.transportMode]) * 60)
    }));
    
    return filtered.slice(0, 5); // 최대 5개
  };
  
  // AI 대화형 검색 처리
  const handleAIChatSubmit = async (message = null) => {
    const inputMessage = message || userInput;
    if (!inputMessage.trim()) return;
    
    // 사용자 메시지 추가
    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsAIThinking(true);
    
    // 시뮬레이션을 위한 딜레이
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // 자연어 파싱 (Mock)
      const conditions = parseNaturalLanguage(inputMessage);
      
      // Mock 데이터 생성
      const restaurants = generateMockRestaurants(conditions);
      
      // AI 응답 생성
      let aiResponseText = '';
      if (restaurants.length > 0) {
        const transportText = {
          walk: '도보',
          car: '차량',
          transit: '대중교통'
        }[conditions.transportMode];
        
        aiResponseText = `${transportText}으로 갈 수 있는 맛집 ${restaurants.length}개를 찾았습니다! `;
        
        if (conditions.keywords.length > 0) {
          aiResponseText += `${conditions.keywords.join(', ')} 조건에 맞는 곳이에요.`;
        }
      } else {
        aiResponseText = '건에 맞는 맛집을 찾지 못했습니다. 조건을 조금 완화해보시겠어요?';
      }
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponseText,
        restaurants: restaurants,
        conditions: conditions,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      
      // 실제 API 호출 코드 (주석 처리)
      /*
      const response = await fetch('/api/restaurant/smart-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          message: inputMessage,
          userLocation,
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.aiResponse,
          restaurants: data.restaurants,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
      }
      */
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '죄송합니다. 검색 중 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAIThinking(false);
    }
  };
  
  // 채팅 스크롤 자동 이동
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              AI와 대화하며 맛집 찾기
            </h1>
          </div>
          <p className="text-gray-600">
            자연어로 원하는 조건을 말해보세요. AI가 딱 맞는 맛집을 찾아드립니다!
          </p>
          {userLocation && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
              <MapPin className="w-4 h-4" />
              <span>현재 위치 확인됨</span>
            </div>
          )}
        </motion.div>
        
        {/* AI 대화창 */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {/* 채팅 영역 */}
            <ScrollArea className="h-[600px] mb-4 p-4 bg-gray-50 rounded-lg">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="w-20 h-20 mx-auto mb-4 text-orange-400" />
                  <h3 className="text-xl mb-2">무엇을 도와드릴까요?</h3>
                  <p className="text-gray-500 mb-6">
                    거리, 이동수단, 음식 종류 등을 자유롭게 말씀해주세요!
                  </p>
                  
                  <div className="space-y-2 max-w-xl mx-auto">
                    <p className="text-sm text-gray-400 mb-3">💡 이렇게 물어보세요:</p>
                    {examplePrompts.map((prompt, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full text-left justify-start text-sm h-auto py-3 hover:bg-orange-50 hover:border-orange-300"
                          onClick={() => handleAIChatSubmit(prompt)}
                        >
                          <Sparkles className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                          <span className="text-gray-700">"{prompt}"</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                        <div
                          className={`p-4 rounded-2xl ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                              : 'bg-white border-2 border-gray-200 shadow-sm'
                          }`}
                        >
                          {msg.content}
                        </div>
                        
                        {/* 검색 조건 표시 */}
                        {msg.conditions && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {msg.conditions.transportMode === 'walk' && '🚶 도보'}
                              {msg.conditions.transportMode === 'car' && '🚗 차량'}
                              {msg.conditions.transportMode === 'transit' && '🚇 대중교통'}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              📍 {msg.conditions.maxDistance}km 이내
                            </Badge>
                            {msg.conditions.keywords.map((keyword, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                🔍 {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {/* 맛집 결과 카드 */}
                        {msg.restaurants && msg.restaurants.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {msg.restaurants.map((restaurant) => (
                              <RestaurantCard 
                                key={restaurant.id} 
                                restaurant={restaurant}
                                userLocation={userLocation}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                          <UserIcon className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isAIThinking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white border-2 border-gray-200 p-4 rounded-2xl shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                          <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </ScrollArea>
            
            {/* 입력창 */}
            <div className="flex gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAIChatSubmit()}
                placeholder="예: 현재 위치에서 도보 10분 이내 혼밥하기 좋은 한식당"
                className="flex-1 h-12"
                disabled={isAIThinking}
              />
              <Button
                onClick={() => handleAIChatSubmit()}
                disabled={isAIThinking || !userInput.trim()}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 h-12 px-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ==================== 맛집 카드 컴포넌트 ====================
function RestaurantCard({ restaurant, userLocation }) {
  const { user, token } = useAuth();
  const [isFavorite, setIsFavorite] = useState(restaurant.isFavorite || false);
  
  // 찜하기 토글
  const toggleFavorite = async () => {
    if (!user || !token) {
      alert('찜하기 기능은 로그인이 필요합니다.');
      return;
    }
    
    // UI 먼저 업데이트
    setIsFavorite(!isFavorite);
    
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          restaurant_id: restaurant.id,
          restaurant_name: restaurant.name,
          category: restaurant.category,
          address: restaurant.address,
          phone: restaurant.phone || '',
          url: restaurant.url || '',
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        alert(`${restaurant.name} 식당이 찜목록에 저장되었습니다.`);
      } else {
        setIsFavorite(!isFavorite); // 실패하면 되돌림
        alert(data.message || '찜하기에 실패했습니다.');
      }
    } catch (error) {
      console.error('찜하기 오류:', error);
      setIsFavorite(!isFavorite); // 실패하면 되돌림
      alert('찜하기 요청 중 오류가 발생했습니다.');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 rounded-xl shadow-md hover:shadow-lg transition-all"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg mb-1">{restaurant.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="text-xs bg-orange-100 text-orange-700 hover:bg-orange-100">
              {restaurant.category}
            </Badge>
            {restaurant.rating && (
              <div className="flex items-center gap-1 text-yellow-600">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm">{restaurant.rating}</span>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFavorite}
          className={isFavorite ? 'text-red-500' : 'text-gray-400'}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </div>
      
      {/* 주소 */}
      <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>{restaurant.address}</span>
      </div>
      
      {/* 거리/경로 정보 */}
      <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700">{restaurant.distance}km</span>
        </div>
        {restaurant.travelTime && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700">
              약 {restaurant.travelTime}분
            </span>
          </div>
        )}
        {restaurant.transportMode && (
          <Badge variant="outline" className="text-xs">
            {restaurant.transportMode === 'walk' && '🚶 도보'}
            {restaurant.transportMode === 'car' && '🚗 차량'}
            {restaurant.transportMode === 'transit' && '🚇 대중교통'}
          </Badge>
        )}
      </div>
      
      {/* AI 추천 이유 */}
      {restaurant.aiReason && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg mb-3">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">{restaurant.aiReason}</p>
          </div>
        </div>
      )}
      
      {/* 특징 태그 */}
      {restaurant.features && restaurant.features.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {restaurant.features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      )}
      
      {/* 버튼 */}
      <div className="flex gap-2">
        {restaurant.phone && (
          <Button variant="outline" size="sm" className="flex-1 text-xs h-9">
            <Phone className="w-3 h-3 mr-1" />
            전화
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-xs h-9"
          onClick={() => {
            const url = `https://map.kakao.com/link/to/${restaurant.name},${restaurant.latitude},${restaurant.longitude}`;
            window.open(url, '_blank');
          }}
        >
          <Navigation className="w-3 h-3 mr-1" />
          길찾기
        </Button>
        {restaurant.url && (
          <Button variant="outline" size="sm" className="text-xs h-9" asChild>
            <a href={restaurant.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default SmartSearchPage;