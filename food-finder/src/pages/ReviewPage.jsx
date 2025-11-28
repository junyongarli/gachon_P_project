import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Star, ExternalLink, MessageSquare, ImageIcon, Loader2, ChevronUp, ChevronDown, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- [추가됨] 리뷰 목록을 불러오고 보여주는 하위 컴포넌트 ---
function ReviewList({ placeId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!window.google || !placeId) return;

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    
    // 상세 정보 요청 (리뷰 데이터 포함)
    const request = {
      placeId: placeId,
      fields: ['reviews'] 
    };

    service.getDetails(request, (place, status) => {
      setLoading(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        setReviews(place.reviews || []);
      } else {
        setError("리뷰를 불러올 수 없습니다.");
      }
    });
  }, [placeId]);

  if (loading) return <div className="p-4 text-center text-sm text-gray-500"><Loader2 className="w-4 h-4 animate-spin inline mr-2"/>리뷰 로딩 중...</div>;
  if (error) return <div className="p-4 text-center text-sm text-red-500">{error}</div>;
  if (reviews.length === 0) return <div className="p-4 text-center text-sm text-gray-500">등록된 리뷰가 없습니다.</div>;

  return (
    <div className="bg-gray-50 border-t border-gray-100 p-4 space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
      <h4 className="font-bold text-sm text-gray-700 mb-2">최신 Google 리뷰 ({reviews.length}개)</h4>
      {reviews.map((review, idx) => (
        <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {review.profile_photo_url ? (
                <img src={review.profile_photo_url} alt="user" className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-400"/>
                </div>
              )}
              <span className="font-semibold text-gray-800 text-xs">{review.author_name}</span>
            </div>
            <span className="text-xs text-gray-400">{review.relative_time_description}</span>
          </div>
          <div className="flex items-center mb-1">
             {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
             ))}
          </div>
          <p className="text-gray-600 leading-relaxed text-xs">{review.text}</p>
        </div>
      ))}
    </div>
  );
}

// --- 메인 페이지 컴포넌트 ---
function ReviewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  
  // [추가됨] 현재 리뷰를 보고 있는 장소의 ID를 저장
  const [expandedPlaceId, setExpandedPlaceId] = useState(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsApiLoaded(true);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("API Key Missing");
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log("✅ Google Maps API 로드 완료!");
      setIsApiLoaded(true);
    };

    script.onerror = () => {
      console.error("❌ Google Maps API 로드 실패");
    };

    document.head.appendChild(script);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }
    if (!isApiLoaded || !window.google) {
      alert('API 로딩 중입니다.');
      return;
    }

    setIsSearching(true);
    setExpandedPlaceId(null); // 검색 시 기존 열린 리뷰 닫기

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    const request = { query: searchQuery };

    service.textSearch(request, (results, status) => {
      setIsSearching(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setSearchResults(results);
      } else {
        setSearchResults([]);
        if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          alert('검색 결과가 없습니다.');
        }
      }
    });
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-sm text-gray-400">평점 없음</span>;
    return (
      <div className="flex items-center">
        <span className="font-bold text-yellow-500 mr-1">{rating}</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>
    );
  };

  // [추가됨] 리뷰 토글 함수
  const toggleReviews = (placeId) => {
    if (expandedPlaceId === placeId) {
      setExpandedPlaceId(null); // 이미 열려있으면 닫기
    } else {
      setExpandedPlaceId(placeId); // 해당 장소 열기
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      {/* 배경 그래픽 유지 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-lg">
              <Search className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                구글 맛집 검색
              </h1>
              <p className="text-gray-600 mt-1">리뷰와 평점을 바로 확인하세요</p>
            </div>
          </div>
        </motion.div>

        {/* 검색창 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="예: 강남역 파스타, 홍대 카페"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-12 text-lg"
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !isApiLoaded}
                  className="h-12 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold"
                >
                  {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5 mr-2" />}
                  {isSearching ? '검색 중' : '검색'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 검색 결과 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {searchResults.map((place, index) => {
            const photoUrl = place.photos && place.photos.length > 0
              ? place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })
              : null;
            const isOpen = place.opening_hours?.open_now;
            const isExpanded = expandedPlaceId === place.place_id;

            return (
              <motion.div
                key={place.place_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`h-full hover:shadow-xl transition-all border-none bg-white/80 overflow-hidden flex flex-col group rounded-xl ${isExpanded ? 'ring-2 ring-blue-500' : ''}`}>
                  {/* 상단 이미지 및 기본 정보 */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {photoUrl ? (
                      <img src={photoUrl} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 flex-col gap-2">
                        <ImageIcon className="w-10 h-10" /><span className="text-xs">이미지 없음</span>
                      </div>
                    )}
                    {place.opening_hours && (
                      <div className="absolute top-3 right-3">
                        <Badge className={`${isOpen ? 'bg-green-500' : 'bg-red-500'} text-white border-none shadow-md`}>
                          {isOpen ? '영업 중' : '영업 종료'}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{place.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(place.rating)}
                        <span className="text-xs text-gray-500">({place.user_ratings_total?.toLocaleString()} 리뷰)</span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{place.formatted_address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {/* 리뷰 보기 버튼 (수정됨) */}
                      <Button 
                        variant={isExpanded ? "secondary" : "outline"}
                        className="w-full border-blue-200 hover:bg-blue-50 text-blue-600"
                        onClick={() => toggleReviews(place.place_id)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {isExpanded ? '리뷰 닫기' : '리뷰 보기'}
                        {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                      </Button>

                      {/* 구글맵 이동 버튼 */}
                      <Button 
                        className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white"
                        onClick={() => window.open(`https://www.google.com/maps/place/?q=place_id:${place.place_id}`, '_blank')}
                      >
                        지도 보기
                        <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                      </Button>
                    </div>
                  </CardContent>

                  {/* 리뷰 리스트 영역 (애니메이션 적용) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ReviewList placeId={place.place_id} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* 초기 안내 문구 */}
        {searchResults.length === 0 && !isSearching && (
          <div className="text-center py-20 opacity-60">
             <div className="bg-white/50 inline-block p-6 rounded-full mb-4">
                <Search className="w-12 h-12 text-gray-400" />
             </div>
             <h3 className="text-xl font-medium text-gray-600">찾으시는 맛집을 검색해보세요</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewPage;