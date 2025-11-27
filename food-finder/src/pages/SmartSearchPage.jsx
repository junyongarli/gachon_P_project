import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Search, MapPin, Phone, ExternalLink, Heart, Star, Navigation, Clock, 
  Car, Sparkles, TrendingUp, DollarSign, Users, Dog, Wifi, ParkingCircle,
  Send, Bot, User as UserIcon, Route, Footprints, Brain, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';

function SmartSearchPage() {
  const { user, token } = useAuth();
  
  // 탭 상태
  const [activeTab, setActiveTab] = useState('ai-chat');
  
  // AI 대화형 검색
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const chatEndRef = useRef(null);
  
  // 거리/경로 기반 검색
  const [userLocation, setUserLocation] = useState(null);
  const [maxDistance, setMaxDistance] = useState([3]); // 최대 거리 (km)
  const [transportMode, setTransportMode] = useState('walk'); // walk, car, transit
  const [showRouteInfo, setShowRouteInfo] = useState(true);
  
  // 개인화 설정
  const [personalPreferences, setPersonalPreferences] = useState({
    favoriteCuisines: [],
    tastePreference: '',
    atmospherePreference: '',
    priceRange: '',
    diningType: '',
  });
  const [learningEnabled, setLearningEnabled] = useState(true);
  const [userHistory, setUserHistory] = useState([]);
  
  // 검색 결과
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // AI 대화 예시 프롬프트
  const examplePrompts = [
    "차 없이 갈 만한 분위기 좋은 이탈리안 레스토랑 알려줘",
    "반려동물 입장 가능한 카페 + 저녁 식사 가능",
    "도보 10분 이내 혼밥하기 좋은 한식당",
    "주차 가능하고 단체 모임하기 좋은 곳",
    "30분 이내 갈 수 있는 데이트하기 좋은 양식당"
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
  
  // 사용자 학습 데이터 불러오기
  useEffect(() => {
    if (user && token && learningEnabled) {
      fetchUserPreferences();
      fetchUserHistory();
    }
  }, [user, token, learningEnabled]);
  
  // 사용자 선호도 불러오기
  const fetchUserPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPersonalPreferences(data.preferences);
      }
    } catch (error) {
      console.log('선호도 정보를 불러올 수 없습니다.');
    }
  };
  
  // 사용자 방문/검색 히스토리 불러오기
  const fetchUserHistory = async () => {
    try {
      const response = await fetch('/api/user/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUserHistory(data.history);
      }
    } catch (error) {
      console.log('히스토리 정보를 불러올 수 없습니다.');
    }
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
    
    try {
      // MOCK: AI API 호출 시뮬레이션 (실제로는 /api/ai/search 호출)
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
      
      // MOCK 데이터 생성
      const mockRestaurants = generateMockRestaurants(inputMessage, userLocation);
      const mockAIResponse = generateMockAIResponse(inputMessage, mockRestaurants);
      
      // AI 응답 메시지 추가
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: mockAIResponse,
        restaurants: mockRestaurants,
        searchCriteria: { message: inputMessage },
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
      setSearchResults(mockRestaurants);
      
      /* 실제 API 호출 코드 (백엔드 완성 시 사용)
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          message: inputMessage,
          userLocation,
          userPreferences: personalPreferences,
          userHistory: learningEnabled ? userHistory : []
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.aiResponse,
          restaurants: data.restaurants,
          searchCriteria: data.searchCriteria,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
        setSearchResults(data.restaurants);
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
  
  // 거리/경로 기반 검색
  const handleDistanceSearch = async () => {
    if (!userLocation) {
      alert('위치 정보를 가져올 수 없습니다. GPS를 켜주세요.');
      return;
    }
    
    setIsSearching(true);
    
    try {
      const response = await fetch('/api/restaurant/nearby-smart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          maxDistance: maxDistance[0],
          transportMode,
          userPreferences: learningEnabled ? personalPreferences : null
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.restaurants);
      }
    } catch (error) {
      console.log('검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };
  
  // 개인화 추천 검색
  const handlePersonalizedSearch = async () => {
    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }
    
    setIsSearching(true);
    
    try {
      const response = await fetch('/api/restaurant/personalized', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userLocation,
          preferences: personalPreferences,
          history: userHistory
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.restaurants);
      }
    } catch (error) {
      console.log('개인화 추천 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };
  
  // 채팅 스크롤 자동 이동
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  // 거리 계산 (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };
  
  // 예상 시간 계산
  const calculateTravelTime = (distance, mode) => {
    const speeds = {
      walk: 4, // 도보 4km/h
      car: 30, // 차량 30km/h (도심 기준)
      transit: 20 // 대중교통 20km/h
    };
    const hours = distance / speeds[mode];
    const minutes = Math.round(hours * 60);
    return minutes;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            스마트 검색
          </h1>
          <p className="text-gray-600">
            AI 대화, 거리/경로, 개인화 추천으로 딱 맞는 맛집을 찾아보세요
          </p>
        </motion.div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="ai-chat" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI 대화형 검색
            </TabsTrigger>
            <TabsTrigger value="distance" className="flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              거리/경로 검색
            </TabsTrigger>
          </TabsList>
          
          {/* ==================== AI 대화형 검색 ==================== */}
          <TabsContent value="ai-chat" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* 대화창 */}
              <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    AI와 대화하며 맛집 찾기
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* 채팅 영역 */}
                  <ScrollArea className="h-[400px] mb-4 p-4 bg-gray-50 rounded-lg">
                    {chatMessages.length === 0 ? (
                      <div className="text-center py-12">
                        <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500 mb-4">
                          AI에게 원하는 맛집 조건을 자연어로 물어보세요!
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-400">예시:</p>
                          {examplePrompts.map((prompt, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="w-full text-left justify-start text-sm"
                              onClick={() => handleAIChatSubmit(prompt)}
                            >
                              "{prompt}"
                            </Button>
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
                            <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                              <div
                                className={`p-3 rounded-lg ${
                                  msg.role === 'user'
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                    : 'bg-white border border-gray-200'
                                }`}
                              >
                                {msg.content}
                              </div>
                              {msg.restaurants && msg.restaurants.length > 0 && (
                                <div className="mt-2 text-sm text-gray-500">
                                  {msg.restaurants.length}개의 맛집을 찾았습니다 →
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
                            <div className="bg-white border border-gray-200 p-3 rounded-lg">
                              <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
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
                      onKeyPress={(e) => e.key === 'Enter' && handleAIChatSubmit()}
                      placeholder="예: 차 없이 갈 만한 분위기 좋은 이탈리안 레스토랑 알려줘"
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleAIChatSubmit()}
                      disabled={isAIThinking || !userInput.trim()}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* 검색 결과 */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">검색 결과</CardTitle>
                </CardHeader>
                <CardContent>
                  {searchResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">검색 결과가 여기 표시됩니다</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {searchResults.map((restaurant) => (
                          <RestaurantCard key={restaurant.id} restaurant={restaurant} userLocation={userLocation} />
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* ==================== 거리/경로 검색 ==================== */}
          <TabsContent value="distance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* 검색 옵션 */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="w-5 h-5 text-orange-500" />
                    경로 옵션
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 이동 수단 */}
                  <div className="space-y-3">
                    <Label>이동 수단</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={transportMode === 'walk' ? 'default' : 'outline'}
                        onClick={() => setTransportMode('walk')}
                        className={transportMode === 'walk' ? 'bg-gradient-to-r from-orange-500 to-red-500' : ''}
                      >
                        <Footprints className="w-4 h-4 mr-2" />
                        도보
                      </Button>
                      <Button
                        variant={transportMode === 'car' ? 'default' : 'outline'}
                        onClick={() => setTransportMode('car')}
                        className={transportMode === 'car' ? 'bg-gradient-to-r from-orange-500 to-red-500' : ''}
                      >
                        <Car className="w-4 h-4 mr-2" />
                        차량
                      </Button>
                      <Button
                        variant={transportMode === 'transit' ? 'default' : 'outline'}
                        onClick={() => setTransportMode('transit')}
                        className={transportMode === 'transit' ? 'bg-gradient-to-r from-orange-500 to-red-500' : ''}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        대중교통
                      </Button>
                    </div>
                  </div>
                  
                  {/* 최대 거리 */}
                  <div className="space-y-3">
                    <Label>최대 거리: {maxDistance[0]}km</Label>
                    <Slider
                      value={maxDistance}
                      onValueChange={setMaxDistance}
                      max={10}
                      min={0.5}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0.5km</span>
                      <span>10km</span>
                    </div>
                  </div>
                  
                  {/* 경로 정보 표시 */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="route-info">경로 정보 표시</Label>
                    <Switch
                      id="route-info"
                      checked={showRouteInfo}
                      onCheckedChange={setShowRouteInfo}
                    />
                  </div>
                  
                  {/* 현재 위치 */}
                  {userLocation && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">현재 위치 확인됨</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        위도: {userLocation.latitude.toFixed(4)}, 경도: {userLocation.longitude.toFixed(4)}
                      </p>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleDistanceSearch}
                    disabled={!userLocation || isSearching}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    {isSearching ? '검색 중...' : '주변 맛집 검색'}
                  </Button>
                </CardContent>
              </Card>
              
              {/* 검색 결과 */}
              <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>검색 결과</CardTitle>
                </CardHeader>
                <CardContent>
                  {searchResults.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Navigation className="w-16 h-16 mx-auto mb-4" />
                      <p>검색 옵션을 설정하고 검색 버튼을 눌러주세요</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-4">
                        {searchResults.map((restaurant) => (
                          <RestaurantCard 
                            key={restaurant.id} 
                            restaurant={restaurant} 
                            userLocation={userLocation}
                            transportMode={transportMode}
                            showRouteInfo={showRouteInfo}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ==================== 맛집 카드 컴포넌트 ====================
function RestaurantCard({ restaurant, userLocation, transportMode = 'walk', showRouteInfo = false, showPersonalMatch = false }) {
  const { user, token } = useAuth();
  const [isFavorite, setIsFavorite] = useState(restaurant.isFavorite || false);
  
  // 거리 계산
  const distance = userLocation && restaurant.latitude && restaurant.longitude
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        restaurant.latitude,
        restaurant.longitude
      )
    : null;
  
  // 이동 시간 계산
  const travelTime = distance ? calculateTravelTime(distance, transportMode) : null;
  
  // 찜하기 토글
  const toggleFavorite = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ restaurantId: restaurant.id })
      });
      
      const data = await response.json();
      if (data.success) {
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.log('찜 처리 중 오류가 발생했습니다.');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{restaurant.category}</Badge>
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
      <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>{restaurant.address}</span>
      </div>
      
      {/* 거리/경로 정보 */}
      {showRouteInfo && distance && (
        <div className="flex items-center gap-4 p-2 bg-blue-50 border border-blue-200 rounded mb-2">
          <div className="flex items-center gap-1">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700">{distance}km</span>
          </div>
          {travelTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                약 {travelTime}분
                {transportMode === 'walk' && ' (도보)'}
                {transportMode === 'car' && ' (차량)'}
                {transportMode === 'transit' && ' (대중교통)'}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* 개인화 매칭도 */}
      {showPersonalMatch && restaurant.personalMatchScore && (
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            취향 매칭도 {restaurant.personalMatchScore}%
          </Badge>
          {restaurant.matchReason && (
            <p className="text-xs text-gray-600">{restaurant.matchReason}</p>
          )}
        </div>
      )}
      
      {/* AI 추천 이유 */}
      {restaurant.aiReason && (
        <div className="p-2 bg-orange-50 border border-orange-200 rounded mb-2">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">{restaurant.aiReason}</p>
          </div>
        </div>
      )}
      
      {/* 특징 태그 */}
      {restaurant.features && restaurant.features.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature.icon && <span className="mr-1">{feature.icon}</span>}
              {feature.name}
            </Badge>
          ))}
        </div>
      )}
      
      {/* 버튼 */}
      <div className="flex gap-2">
        {restaurant.phone && (
          <Button variant="outline" size="sm" className="flex-1">
            <Phone className="w-4 h-4 mr-1" />
            전화
          </Button>
        )}
        <Button variant="outline" size="sm" className="flex-1">
          <Route className="w-4 h-4 mr-1" />
          길찾기
        </Button>
        <Button variant="outline" size="sm">
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// 유틸리티 함수들
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
}

function calculateTravelTime(distance, mode) {
  const speeds = {
    walk: 4,
    car: 30,
    transit: 20
  };
  const hours = distance / speeds[mode];
  const minutes = Math.round(hours * 60);
  return minutes;
}

// MOCK 데이터 생성 함수들
function generateMockRestaurants(inputMessage, userLocation) {
  const mockRestaurants = [
    {
      id: 1,
      name: "이탈리안 레스토랑",
      category: "이탈리안",
      rating: 4.5,
      address: "서울특별시 강남구 논현동 123-45",
      latitude: userLocation ? userLocation.latitude + 0.01 : 37.5172,
      longitude: userLocation ? userLocation.longitude + 0.01 : 127.0473,
      features: [
        { name: "주차 가능", icon: <ParkingCircle className="w-4 h-4" /> },
        { name: "와이파이 제공", icon: <Wifi className="w-4 h-4" /> }
      ],
      aiReason: "요청하신 조건에 맞는 이탈리안 레스토랑입니다."
    },
    {
      id: 2,
      name: "한식당",
      category: "한식",
      rating: 4.2,
      address: "서울특별시 강남구 논현동 678-90",
      latitude: userLocation ? userLocation.latitude - 0.01 : 37.5172,
      longitude: userLocation ? userLocation.longitude - 0.01 : 127.0473,
      features: [
        { name: "주차 가능", icon: <ParkingCircle className="w-4 h-4" /> },
        { name: "와이파이 제공", icon: <Wifi className="w-4 h-4" /> }
      ],
      aiReason: "요청하신 조건에 맞는 한식당입니다."
    }
  ];
  
  // 입력 메시지에 따라 필터링
  if (inputMessage.includes("이탈리안")) {
    return mockRestaurants.filter(r => r.category === "이탈리안");
  } else if (inputMessage.includes("한식")) {
    return mockRestaurants.filter(r => r.category === "한식");
  } else {
    return mockRestaurants;
  }
}

function generateMockAIResponse(inputMessage, mockRestaurants) {
  const restaurantNames = mockRestaurants.map(r => r.name).join(", ");
  return `요청하신 조건에 맞는 맛집들을 찾았습니다: ${restaurantNames}`;
}

export default SmartSearchPage;