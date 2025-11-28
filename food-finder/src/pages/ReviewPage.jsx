import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, Search, MapPin, ExternalLink, MessageSquare, Phone } from 'lucide-react'; // Phone 아이콘 추가
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
    
    // window.kakao 객체가 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps) {
        alert('카카오맵 API가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
        setIsSearching(false);
        return;
    }

    // 카카오 장소 검색 API
    const ps = new window.kakao.maps.services.Places();
    
    // ✅ [수정 핵심] 검색 옵션 설정: 음식점(FD6)만 검색되도록 필터링
    const searchOptions = {
        category_group_code: 'FD6', // FD6: 음식점, CE7: 카페
        size: 10, // 한 번에 가져올 최대 개수
    };
    
    // 3번째 인자로 options 전달
    ps.keywordSearch(searchQuery, (data, status) => {
      setIsSearching(false);
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(data);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        setSearchResults([]);
        alert('검색 결과가 없습니다.');
      } else {
        setSearchResults([]);
        alert('검색 중 오류가 발생했습니다.');
      }
    }, searchOptions); // <-- 여기에 옵션 추가
  };

  // ✅ [수정됨] 카카오맵 상세 페이지(리뷰) 열기
  const openKakaoMapReview = (place) => {
    // place_url: 장소 상세페이지 URL (리뷰, 사진 포함)
    const url = place.place_url; 
    window.open(url+'#review');
  };

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 유지 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold">
                맛집 리뷰 찾기
              </h1>
              <p className="text-gray-600 mt-1">식당 이름을 검색하고 실제 리뷰를 확인하세요</p>
            </div>
          </div>
        </motion.div>

        {/* 검색 영역 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="맛집 이름을 검색하세요 (예: 강남역 파스타, 홍대 카페)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="h-12 text-lg"
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
            <h2 className="text-2xl text-gray-800 mb-4 font-semibold">검색 결과 ({searchResults.length}개)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`h-full bg-white/80 backdrop-blur-sm shadow-md border hover:shadow-xl transition-all cursor-pointer hover:border-orange-300 ${
                      selectedPlace?.id === place.id ? 'border-orange-500 border-2' : 'border-white/20'
                    }`}
                    onClick={() => handleSelectPlace(place)}
                  >
                    <CardContent className="p-6 flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{place.place_name}</h3>
                                <p className="text-sm text-gray-500">{place.category_name?.split(' > ').pop()}</p>
                            </div>
                            
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 mb-4 mt-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 text-orange-500" />
                            <span>{place.road_address_name || place.address_name}</span>
                          </div>
                          {place.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-orange-500" />
                              <span>{place.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          openKakaoMapReview(place);
                        }}
                        className="w-full mt-2 bg-white border-2 border-orange-100 text-orange-600 hover:bg-orange-50 hover:border-orange-200"
                        variant="outline"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        리뷰 & 상세정보 보기
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 결과 없음 UI 유지... */}
        {searchResults.length === 0 && !isSearching && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-600 mb-2 font-medium">맛집을 검색해보세요</p>
                <p className="text-gray-500">카카오맵의 생생한 리뷰를 확인하실 수 있습니다.</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

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