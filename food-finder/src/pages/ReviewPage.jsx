import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, Search, MapPin, ExternalLink, MessageSquare, Calendar, User } from 'lucide-react';
import { motion } from 'motion/react';

function ReviewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // 카카오맵에서 장소 검색
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    setIsSearching(true);
    
    // 카카오 장소 검색 API
    const ps = new window.kakao.maps.services.Places();
    
    ps.keywordSearch(searchQuery, (data, status) => {
      setIsSearching(false);
      
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(data.slice(0, 10)); // 상위 10개만
        setSelectedPlace(null);
      } else {
        alert('검색 결과가 없습니다.');
        setSearchResults([]);
      }
    });
  };

  // 카카오맵에서 리뷰 보기 (새 창에서 열기)
  const openKakaoMapReview = (place) => {
    const url = `https://map.kakao.com/link/to/${place.place_name},${place.y},${place.x}`;
    window.open(url, '_blank');
  };

  // 장소 선택
  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
  };

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
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                카카오맵 리뷰 조회
              </h1>
              <p className="text-gray-600 mt-1">카카오맵에서 맛집 리뷰를 확인하세요</p>
            </div>
          </div>
        </motion.div>

        {/* 검색 영역 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="맛집 이름을 검색하세요 (예: 강남 맛집, 홍대 카페)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="h-12"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="h-12 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {isSearching ? '검색 중...' : '검색'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 검색 결과 */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl text-gray-800 mb-4">검색 결과 ({searchResults.length}개)</h2>
            
            <div className="grid grid-cols-1 gap-4">
              {searchResults.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`bg-white/80 backdrop-blur-sm shadow-lg border hover:shadow-xl transition-all cursor-pointer ${
                      selectedPlace?.id === place.id ? 'border-orange-500 border-2' : 'border-white/20'
                    }`}
                    onClick={() => handleSelectPlace(place)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl text-gray-800">
                              {place.place_name}
                            </h3>
                            {place.category_name && (
                              <Badge className="bg-orange-100 text-orange-700 border-none">
                                {place.category_name.split(' > ').pop()}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{place.address_name || place.road_address_name}</span>
                            </div>
                            {place.phone && (
                              <div className="flex items-center gap-2">
                                <span className="text-orange-600">📞</span>
                                <span>{place.phone}</span>
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              openKakaoMapReview(place);
                            }}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            카카오맵에서 리뷰 보기
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 초기 상태 또는 검색 결과 없을 때 */}
        {searchResults.length === 0 && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-2">맛집을 검색해보세요</p>
                <p className="text-gray-500">카카오맵의 리뷰를 확인할 수 있습니다</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 안내 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg text-gray-800 mb-2">카카오맵 리뷰란?</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    카카오맵에서 실제 방문자들이 남긴 리뷰와 평점을 확인할 수 있습니다. 
                    "카카오맵에서 리뷰 보기" 버튼을 클릭하면 해당 맛집의 상세 정보와 리뷰를 확인할 수 있습니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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

export default ReviewPage;
