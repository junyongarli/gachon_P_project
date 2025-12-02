import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, ExternalLink, Heart, Utensils, Sparkles, Trash2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

// --- [지도 컴포넌트] (스타일 유지 + 정보창 추가) ---
const GoogleMap = ({ restaurants }) => {
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
    } else {
        initMap();
    }

    function initMap() {
      const container = document.getElementById('favorites-map');
      if (!container) return;

      // 1. 지도 중심 설정 (첫 번째 찜한 곳 기준, 없으면 서울)
      let center = { lat: 37.5665, lng: 126.9780 };
      if (restaurants.length > 0) {
          // DB 컬럼명(x, y) 또는 기존 latitude, longitude 모두 대응
          const first = restaurants[0];
          const lat = parseFloat(first.y || first.latitude);
          const lng = parseFloat(first.x || first.longitude);
          if (lat && lng) center = { lat, lng };
      }

      const map = new window.google.maps.Map(container, {
        center: center,
        zoom: 13,
        disableDefaultUI: false,
        zoomControl: true,
      });

      const bounds = new window.google.maps.LatLngBounds();
      const infowindow = new window.google.maps.InfoWindow({ maxWidth: 220 });

      // 2. 마커 및 정보창 추가
      restaurants.forEach((fav, index) => {
        const lat = parseFloat(fav.y || fav.latitude);
        const lng = parseFloat(fav.x || fav.longitude);

        if (!lat || !lng) return; // 좌표 없으면 패스

        const position = { lat, lng };
        
        const marker = new window.google.maps.Marker({
          position: position,
          map: map,
          title: fav.restaurant_name,
          label: String(index + 1), // 마커에 숫자 표시
          animation: window.google.maps.Animation.DROP
        });

        // [핵심] 마커 클릭 시 예쁜 정보창
        const content = `
          <div style="padding: 8px; min-width: 180px; font-family: sans-serif;">
            <h3 style="margin: 0 0 6px; font-size: 15px; font-weight: bold; color: #333;">
                ${fav.restaurant_name}
            </h3>
            <div style="display: flex; align-items: center; margin-bottom: 6px;">
                <span style="background-color: #fff7ed; color: #c2410c; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 6px;">
                    ${fav.category || '식당'}
                </span>
                <span style="color: #f59e0b; font-size: 12px;">★ ${fav.rating ? parseFloat(fav.rating).toFixed(1) : '0.0'}</span>
            </div>
            <div style="font-size: 12px; color: #666; margin-bottom: 8px; line-height: 1.4;">
                ${fav.address || '주소 정보 없음'}
            </div>
            <a href="${fav.url}" target="_blank" style="display: inline-block; width: 100%; text-align: center; background-color: #3b82f6; color: white; text-decoration: none; padding: 6px 0; border-radius: 4px; font-size: 12px; font-weight: 500;">
                구글맵에서 보기
            </a>
          </div>
        `;

        marker.addListener('click', () => {
          infowindow.setContent(content);
          infowindow.open(map, marker);
        });

        bounds.extend(position);
      });

      // 마커가 여러 개면 모두 보이도록 줌 조정
      if (restaurants.length > 0) {
          map.fitBounds(bounds);
      }
    }
  }, [restaurants]);

  return <div id="favorites-map" className="w-full rounded-xl border border-white/20 shadow-lg" style={{ height: '500px' }}></div>;
};

// --- [메인 페이지] (기존 스타일 유지) ---
function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/favorites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setFavorites(data.favorites);
        }
      } catch (error) {
        console.error("찜 목록을 불러오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, [token]);

  const handleDelete = async (favoriteId) => {
    if (!token) return;
    if (!confirm('찜 목록에서 삭제하시겠습니까?')) return;
    
    try {
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      alert('찜 목록에서 삭제되었습니다.');
      
      fetch(`/api/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(err => console.log('백엔드 호출 실패:', err));
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다.');
    }
  };

  // 별점 렌더링 함수
  const renderStars = (rating) => {
    const score = parseFloat(rating) || 0;
    return (
      <div className="flex items-center">
        <span className="font-bold text-yellow-500 mr-1 text-sm">{score.toFixed(1)}</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.round(score) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="relative z-10 text-center">
          <h2 className="text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            찜한 맛집 목록을 불러오는 중<span className="animate-pulse">...</span>
          </h2>
        </motion.div>
      </div>
    );
  }

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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-lg">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold">찜한 맛집 목록</h1>
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-gray-600 mt-1">저장한 맛집들을 모아서 확인하세요</p>
            </div>
          </div>
          {favorites.length > 0 && (
            <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white border-none">총 {favorites.length}개의 맛집</Badge>
          )}
        </motion.div>

        {/* 찜 목록 */}
        {!token ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-4">로그인이 필요한 서비스입니다</p>
                <p className="text-gray-500">찜한 맛집을 확인하려면 로그인해주세요</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : favorites.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* 왼쪽: 지도 (고정) */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="w-full lg:w-2/5 lg:sticky lg:top-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-800 flex items-center gap-2 font-bold"><MapPin className="w-5 h-5 text-orange-500" /> 지도</h3>
                  <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white border-none">{favorites.length}개 발견</Badge>
                </div>
                {/* 수정된 GoogleMap 컴포넌트 사용 */}
                <GoogleMap restaurants={favorites} />
              </div>
            </motion.div>

            {/* 오른쪽: 찜 목록 (스크롤) */}
            <div className="w-full lg:w-3/5 space-y-4">
              {favorites.map((fav, index) => (
                <motion.div key={fav.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}>
                  <Card className="bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-[1.01]">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow min-w-0">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg p-2 flex-shrink-0">
                              <Utensils className="w-5 h-5" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h3 className="text-xl text-gray-800 mb-1 truncate font-bold">{fav.restaurant_name}</h3>
                              {fav.category && (
                                <Badge className="bg-orange-100 text-orange-700 border-none text-xs">{fav.category}</Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* 별점 표시 */}
                          <div className="flex items-center gap-2 mb-3 ml-11">
                            {renderStars(fav.rating)}
                            <span className="text-xs text-gray-500">({fav.user_ratings_total ? fav.user_ratings_total.toLocaleString() : 0}명 참여)</span>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600 mb-3">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 flex-shrink-0 text-orange-500 mt-0.5" />
                              <span className="break-words">{fav.address || '주소 정보 없음'}</span>
                            </div>
                            {/* 전화번호는 없어서 제거됨 */}
                          </div>

                          <div className="flex gap-2">
                            {fav.url && (
                              <a href={fav.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                                <Button variant="outline" size="sm" className="w-full hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-colors">
                                  상세보기 <ExternalLink className="w-3 h-3 ml-1" />
                                </Button>
                              </a>
                            )}
                            <Button onClick={() => handleDelete(fav.id)} variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardContent className="p-12 text-center">
                <div className="mb-4"><Heart className="w-16 h-16 mx-auto text-gray-400" /></div>
                <p className="text-xl text-gray-600 mb-2">아직 찜한 맛집이 없습니다</p>
                <p className="text-gray-500 mb-6">맛집 퀴즈를 통해 추천받은 맛집을 찜해보세요!</p>
                <a href="/">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                    <Utensils className="w-4 h-4 mr-2" /> 맛집 찾으러 가기
                  </Button>
                </a>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

export default FavoritesPage;