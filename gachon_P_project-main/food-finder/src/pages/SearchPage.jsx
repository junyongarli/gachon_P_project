import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Phone, ExternalLink, Heart, Utensils, Clock, Star, Filter, DollarSign, CarFront, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

function SearchPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating'); // 정렬 기준
  const [priceRange, setPriceRange] = useState('all'); // 가격대
  const [openNow, setOpenNow] = useState(false); // 영업 중만 보기
  const [hasParking, setHasParking] = useState(false); // 주차 가능만 보기
  const [showFilters, setShowFilters] = useState(false); // 필터 표시 여부
  const { user } = useAuth();

  const categories = [
    { id: 'all', name: '전체', icon: '🍽️' },
    { id: 'korean', name: '한식', icon: '🍚' },
    { id: 'chinese', name: '중식', icon: '🥟' },
    { id: 'japanese', name: '일식', icon: '🍣' },
    { id: 'western', name: '양식', icon: '🍝' },
    { id: 'cafe', name: '카페', icon: '☕' },
    { id: 'fastfood', name: '패스트푸드', icon: '🍔' },
  ];

  // 검색 기능 (Mock 데이터)
  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    setIsSearching(true);

    // Mock 검색 결과 (실제로는 API 호출)
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          name: '맛있는 한식당',
          category: '한식',
          address: '서울시 강남구 테헤란로 123',
          phone: '02-1234-5678',
          rating: 4.5,
          reviewCount: 128,
          url: 'https://map.kakao.com',
          image: 'https://via.placeholder.com/300x200',
        },
        {
          id: 2,
          name: '이탈리안 레스토랑',
          category: '양식',
          address: '서울시 강남구 역삼동 456',
          phone: '02-2345-6789',
          rating: 4.8,
          reviewCount: 256,
          url: 'https://map.kakao.com',
          image: 'https://via.placeholder.com/300x200',
        },
        {
          id: 3,
          name: '스시 오마카세',
          category: '일식',
          address: '서울시 강남구 삼성동 789',
          phone: '02-3456-7890',
          rating: 4.7,
          reviewCount: 89,
          url: 'https://map.kakao.com',
          image: 'https://via.placeholder.com/300x200',
        },
      ];

      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  // 찜하기 기능
  const handleFavorite = (restaurant) => {
    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }
    // TODO: API 연동
    alert(`${restaurant.name}을(를) 찜 목록에 추가했습니다!`);
  };

  const filteredResults = selectedCategory === 'all' 
    ? searchResults 
    : searchResults.filter(r => r.category === categories.find(c => c.id === selectedCategory)?.name);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
      
      {/* 배경 장식 요소 */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-lg">
              <Search className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                맛집 검색
              </h1>
              <p className="text-gray-600 mt-1">원하는 맛집을 검색하고 정보를 확인하세요</p>
            </div>
          </div>
        </motion.div>

        {/* 검색 바 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="맛집 이름, 음식 종류, 지역을 입력하세요"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? '검색 중...' : '검색'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 카테고리 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600">카테고리</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    className={
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300'
                    }
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 추가 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600">추가 필터</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  size="sm"
                  className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
                >
                  {showFilters ? '필터 숨기기' : '필터 보기'}
                </Button>
              </div>
              {showFilters && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Label className="text-sm text-gray-600">정렬 기준</Label>
                    <Select
                      value={sortBy}
                      onValueChange={setSortBy}
                      className="w-40"
                    >
                      <SelectTrigger className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                        <SelectValue placeholder="정렬 기준 선택">
                          {sortBy}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                        <SelectItem value="rating">평점 순</SelectItem>
                        <SelectItem value="reviewCount">리뷰 순</SelectItem>
                        <SelectItem value="name">이름 순</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Label className="text-sm text-gray-600">가격대</Label>
                    <Select
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-40"
                    >
                      <SelectTrigger className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                        <SelectValue placeholder="가격대 선택">
                          {priceRange}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="low">저가</SelectItem>
                        <SelectItem value="medium">중가</SelectItem>
                        <SelectItem value="high">고가</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Checkbox
                      checked={openNow}
                      onCheckedChange={setOpenNow}
                      className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20"
                    />
                    <Label className="text-sm text-gray-600">영업 중만 보기</Label>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Checkbox
                      checked={hasParking}
                      onCheckedChange={setHasParking}
                      className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20"
                    />
                    <Label className="text-sm text-gray-600">주차 가능만 보기</Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 검색 결과 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isSearching ? (
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardContent className="p-12 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">검색 중입니다...</p>
              </CardContent>
            </Card>
          ) : filteredResults.length > 0 ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                  총 <span className="text-orange-600">{filteredResults.length}</span>개의 맛집을 찾았습니다
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((restaurant, index) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-[1.02] h-full">
                      <CardContent className="p-0">
                        {/* 이미지 */}
                        <div className="relative h-48 bg-gradient-to-br from-orange-200 to-red-200 rounded-t-lg overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Utensils className="w-16 h-16 text-white opacity-50" />
                          </div>
                          <Button
                            onClick={() => handleFavorite(restaurant)}
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          >
                            <Heart className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>

                        {/* 내용 */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl text-gray-800">
                              {restaurant.name}
                            </h3>
                          </div>

                          <Badge className="bg-orange-100 text-orange-700 border-none mb-3">
                            {restaurant.category}
                          </Badge>

                          <div className="flex items-center gap-1 mb-3">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm text-gray-700">{restaurant.rating}</span>
                            <span className="text-sm text-gray-500">({restaurant.reviewCount})</span>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 flex-shrink-0 text-orange-500 mt-0.5" />
                              <span className="break-words">{restaurant.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 flex-shrink-0 text-orange-500" />
                              <span>{restaurant.phone}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <a href={restaurant.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
                              >
                                상세보기
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : searchKeyword ? (
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-2">검색 결과가 없습니다</p>
                <p className="text-gray-500">다른 검색어로 시도해보세요</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-2">검색어를 입력해주세요</p>
                <p className="text-gray-500">맛집 이름, 음식 종류, 지역으로 검색할 수 있습니다</p>
              </CardContent>
            </Card>
          )}
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

export default SearchPage;