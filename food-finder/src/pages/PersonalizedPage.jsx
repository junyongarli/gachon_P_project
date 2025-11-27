import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Heart, Star, MapPin, Phone, ExternalLink, Route, 
  TrendingUp, History, Sparkles, ChefHat, Clock, DollarSign,
  Utensils, Wine, UtensilsCrossed, Flame, Soup, Users, User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function PersonalizedPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  // 개인화 설정
  const [learningEnabled, setLearningEnabled] = useState(true);
  const [personalPreferences, setPersonalPreferences] = useState({
    favoriteCuisines: [],
    tastePreference: '',
    atmospherePreference: '',
    priceRange: '',
    diningType: '',
  });
  const [userHistory, setUserHistory] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  
  // 추천 결과
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  
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
      // MOCK 데이터 (실제로는 API 호출)
      const mockPreferences = {
        favoriteCuisines: ['한식', '이탈리안', '일식'],
        tastePreference: 'spicy',
        atmospherePreference: 'casual',
        priceRange: 'medium',
        diningType: 'alone',
      };
      setPersonalPreferences(mockPreferences);
      
      /* 실제 API 호출
      const response = await fetch('/api/user/preferences', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPersonalPreferences(data.preferences);
      }
      */
    } catch (error) {
      console.log('선호도 정보를 불러올 수 없습니다.');
    }
  };
  
  // 사용자 방문/검색 히스토리 불러오기
  const fetchUserHistory = async () => {
    try {
      // MOCK 데이터
      const mockHistory = [
        { restaurantId: 1, category: '한식', rating: 4.5, visitedAt: '2024-01-15' },
        { restaurantId: 2, category: '한식', rating: 5.0, visitedAt: '2024-01-12' },
        { restaurantId: 3, category: '양식', rating: 4.8, visitedAt: '2024-01-10' },
        { restaurantId: 4, category: '한식', rating: 4.2, visitedAt: '2024-01-08' },
        { restaurantId: 5, category: '일식', rating: 4.7, visitedAt: '2024-01-05' },
      ];
      setUserHistory(mockHistory);
      
      /* 실제 API 호출
      const response = await fetch('/api/user/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUserHistory(data.history);
      }
      */
    } catch (error) {
      console.log('히스토리 정보를 불러올 수 없습니다.');
    }
  };
  
  // 개인화 추천 검색
  const handlePersonalizedSearch = async () => {
    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // MOCK 데이터 생성
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
      
      const mockRecommendations = [
        {
          id: 1,
          name: '매콤 떡볶이 전문점',
          category: '한식',
          address: '서울시 강남구 역삼동 456',
          latitude: 37.5012,
          longitude: 127.0396,
          phone: '02-9876-5432',
          rating: 4.7,
          personalMatchScore: 96,
          matchReason: '자주 방문하는 매운 한식과 비슷한 스타일이에요. 혼밥하기 좋은 분위기도 당신 취향!',
          features: [
            { name: '혼밥 추천', icon: '🍽️' },
            { name: '매운맛', icon: '🌶️' },
            { name: '가성비', icon: '💰' }
          ],
          distance: 1.2,
          isFavorite: false
        },
        {
          id: 2,
          name: '정통 일본 라멘',
          category: '일식',
          address: '서울시 서초구 서초동 789',
          latitude: 37.4833,
          longitude: 127.0322,
          phone: '02-8765-4321',
          rating: 4.8,
          personalMatchScore: 88,
          matchReason: '국물 요리를 좋아하시고, 일식 방문 기록이 있어요. 진한 국물이 일품입니다!',
          features: [
            { name: '국물 요리', icon: '🍜' },
            { name: '일식', icon: '🇯🇵' },
            { name: '혼밥 가능', icon: '👤' }
          ],
          distance: 2.1,
          isFavorite: true
        },
        {
          id: 3,
          name: '이탈리안 트라토리아',
          category: '양식',
          address: '서울시 강남구 청담동 123',
          latitude: 37.5245,
          longitude: 127.0392,
          phone: '02-7654-3210',
          rating: 4.9,
          personalMatchScore: 85,
          matchReason: '이탈리안 선호도가 높고, 중가 레스토랑을 자주 방문하시네요. 분위기도 좋아요!',
          features: [
            { name: '로맨틱', icon: '💑' },
            { name: '파스타', icon: '🍝' },
            { name: '와인', icon: '🍷' }
          ],
          distance: 3.5,
          isFavorite: false
        }
      ];
      
      setRecommendations(mockRecommendations);
      setHasLoaded(true);
      
      /* 실제 API 호출
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
        setRecommendations(data.restaurants);
        setHasLoaded(true);
      }
      */
    } catch (error) {
      console.log('개인화 추천 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 카테고리별 방문 비율 계산
  const calculateCategoryStats = () => {
    if (userHistory.length === 0) return [];
    
    const categoryCount = {};
    userHistory.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    
    return Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / userHistory.length) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  };
  
  const categoryStats = calculateCategoryStats();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI 개인화 추천
              </h1>
              <p className="text-gray-600">
                당신의 취향을 학습해서 딱 맞는 맛집만 추천해드려요
              </p>
            </div>
          </div>
        </motion.div>
        
        {user ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽: 학습 정보 */}
            <div className="lg:col-span-1 space-y-4">
              {/* 학습 설정 카드 */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    AI 학습 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 학습 활성화 토글 */}
                  <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div>
                      <Label htmlFor="learning" className="text-purple-700 cursor-pointer">
                        AI 학습 활성화
                      </Label>
                      <p className="text-xs text-purple-600 mt-1">
                        내 취향을 학습해서 더 정확한 추천
                      </p>
                    </div>
                    <Switch
                      id="learning"
                      checked={learningEnabled}
                      onCheckedChange={setLearningEnabled}
                    />
                  </div>
                  
                  {learningEnabled && (
                    <Button
                      onClick={handlePersonalizedSearch}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          AI가 분석 중...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          나만의 맞춤 추천받기
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              {/* 학습 데이터 카드 */}
              {learningEnabled && (
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <History className="w-5 h-5 text-purple-500" />
                      학습 데이터
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 방문 횟수 */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">방문한 맛집</span>
                        <span className="font-semibold text-purple-600">{userHistory.length}곳</span>
                      </div>
                    </div>
                    
                    {/* 카테고리별 통계 */}
                    {categoryStats.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 mb-2">선호 음식</p>
                        {categoryStats.map((stat, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{stat.category}</span>
                              <span className="text-purple-600 font-semibold">{stat.percentage}%</span>
                            </div>
                            <Progress value={stat.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* 선호 가격대 */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">선호 가격대</span>
                        <span className="text-sm">
                          {personalPreferences.priceRange === 'medium' ? '1-2만원대' : '수집 중'}
                        </span>
                      </div>
                    </div>
                    
                    {/* 식사 유형 */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">주요 식사 유형</span>
                        <span className="text-sm">
                          {personalPreferences.diningType === 'alone' ? '혼밥' : '수집 중'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* 학습 인사이트 */}
              {learningEnabled && userHistory.length > 0 && (
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      AI 인사이트
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-purple-700">
                      <strong>• </strong>한식을 가장 자주 방문하시네요! (60%)
                    </p>
                    <p className="text-purple-700">
                      <strong>• </strong>평균 평점 4.5점 이상 선호
                    </p>
                    <p className="text-purple-700">
                      <strong>• </strong>혼밥 가능한 곳을 주로 찾으심
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* 오른쪽: 추천 결과 */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    당신을 위한 맞춤 추천
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!hasLoaded ? (
                    <div className="text-center py-20">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <Brain className="w-20 h-20 mx-auto mb-4 text-purple-400" />
                      </motion.div>
                      <h3 className="text-xl mb-2 text-gray-700">AI가 당신을 기다리고 있어요</h3>
                      <p className="text-gray-500 mb-6">
                        "나만의 맞춤 추천받기" 버튼을 눌러주세요
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        <ChefHat className="w-4 h-4" />
                        <span>학습한 {userHistory.length}개의 데이터로 분석합니다</span>
                      </div>
                    </div>
                  ) : recommendations.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                      <Utensils className="w-16 h-16 mx-auto mb-4" />
                      <p>추천할 맛집이 없습니다</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-4">
                        <AnimatePresence>
                          {recommendations.map((restaurant, index) => (
                            <motion.div
                              key={restaurant.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <RestaurantCard 
                                restaurant={restaurant} 
                                userLocation={userLocation}
                                showPersonalMatch={true}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // 로그인 안 한 경우
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center py-20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-12 h-12 text-purple-600" />
                  </div>
                </motion.div>
                <h2 className="text-2xl mb-4 text-gray-800">로그인이 필요합니다</h2>
                <p className="text-gray-600 mb-8">
                  AI가 당신의 취향을 학습하려면<br />
                  로그인이 필요해요
                </p>
                <div className="flex gap-3 justify-center">
                  <Link to="/login">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <UserIcon className="w-5 h-5 mr-2" />
                      로그인하기
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      회원가입
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ==================== 맛집 카드 컴포넌트 ====================
function RestaurantCard({ restaurant, userLocation, showPersonalMatch = false }) {
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
    : restaurant.distance;
  
  // 찜하기 토글
  const toggleFavorite = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    setIsFavorite(!isFavorite);
    
    /* 실제 API 호출
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
    */
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-5 bg-white border-2 border-purple-100 rounded-xl shadow-sm hover:shadow-lg transition-all"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl mb-2">{restaurant.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="border-purple-300 text-purple-700">
              {restaurant.category}
            </Badge>
            {restaurant.rating && (
              <div className="flex items-center gap-1 text-yellow-600">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-semibold">{restaurant.rating}</span>
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
          <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </div>
      
      {/* 개인화 매칭도 */}
      {showPersonalMatch && restaurant.personalMatchScore && (
        <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-purple-700">취향 매칭도</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {restaurant.personalMatchScore}%
            </span>
          </div>
          <Progress value={restaurant.personalMatchScore} className="h-2 mb-2" />
          {restaurant.matchReason && (
            <p className="text-sm text-gray-700">{restaurant.matchReason}</p>
          )}
        </div>
      )}
      
      {/* 주소 */}
      <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
        <span>{restaurant.address}</span>
        {distance && (
          <Badge variant="secondary" className="ml-auto">
            {distance}km
          </Badge>
        )}
      </div>
      
      {/* 특징 태그 */}
      {restaurant.features && restaurant.features.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {restaurant.features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              {feature.icon && <span className="mr-1">{feature.icon}</span>}
              {feature.name}
            </Badge>
          ))}
        </div>
      )}
      
      {/* 버튼 */}
      <div className="flex gap-2">
        {restaurant.phone && (
          <Button variant="outline" size="sm" className="flex-1 border-purple-200 hover:bg-purple-50">
            <Phone className="w-4 h-4 mr-1" />
            전화
          </Button>
        )}
        <Button variant="outline" size="sm" className="flex-1 border-purple-200 hover:bg-purple-50">
          <Route className="w-4 h-4 mr-1" />
          길찾기
        </Button>
        <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50">
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// 유틸리티 함수
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

export default PersonalizedPage;
