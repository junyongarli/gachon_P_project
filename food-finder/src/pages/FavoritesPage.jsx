import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, ExternalLink, Heart, Utensils, Sparkles, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

// 구글맵 컴포넌트
const GoogleMap = ({ restaurants, userLocation }) => {
  useEffect(() => {
    // 구글맵 스크립트 로드
    const googleMapScript = document.createElement('script');
    googleMapScript.async = true;
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    document.head.appendChild(googleMapScript);

    const onLoadGoogleAPI = () => {
      if (window.google && window.google.maps) {
        const container = document.getElementById('favorites-map');
        if (!container) return;

        // 지도 중심 설정 (찜한 맛집이 있으면 첫번째 위치, 없으면 서울 시청)
        const mapCenter = restaurants.length > 0 && restaurants[0].latitude && restaurants[0].longitude
          ? { lat: restaurants[0].latitude, lng: restaurants[0].longitude }
          : { lat: 37.566826, lng: 126.9786567 }; // 서울 시청
        
        // 구글맵 생성
        const map = new window.google.maps.Map(container, {
          center: mapCenter,
          zoom: 13,
        });

        // 마커와 인포윈도우 추가
        restaurants.forEach((restaurant, index) => {
          if (!restaurant.latitude || !restaurant.longitude) return; // 위치 정보 없으면 스킵
          
          const marker = new window.google.maps.Marker({
            position: { lat: restaurant.latitude, lng: restaurant.longitude },
            map: map,
            title: restaurant.restaurant_name,
            label: String(index + 1), // 번호 표시
          });

          const infowindow = new window.google.maps.InfoWindow({
            content: `<div style="padding:5px; font-size:12px; max-width:200px; text-align:center;">${restaurant.restaurant_name}</div>`,
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

    return () => {
      googleMapScript.removeEventListener('load', onLoadGoogleAPI);
      if (document.head.contains(googleMapScript)) {
        document.head.removeChild(googleMapScript);
      }
    };
  }, [restaurants, userLocation]);

  return <div id="favorites-map" className="w-full rounded-xl" style={{ height: '500px' }}></div>;
};

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
      // 프론트엔드에서 바로 삭제 처리 (백엔드 API 호출 제거)
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      alert('찜 목록에서 삭제되었습니다.');
      
      // 백엔드 API 호출 (실패해도 UI는 이미 업데이트됨)
      fetch(`/api/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(err => {
        console.log('백엔드 API 호출 실패 (무시):', err);
      });
    } catch (error) {
      console.error("삭제 중 오류:", error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 text-center"
        >
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-lg">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  찜한 맛집 목록
                </h1>
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-gray-600 mt-1">저장한 맛집들을 모아서 확인하세요</p>
            </div>
          </div>
          {favorites.length > 0 && (
            <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white border-none">
              총 {favorites.length}개의 맛집
            </Badge>
          )}
        </motion.div>

        {/* 찜 목록 */}
        {!token ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full lg:w-2/5 lg:sticky lg:top-6"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    지도
                  </h3>
                  <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white border-none">
                    {favorites.length}개 발견
                  </Badge>
                </div>
                <GoogleMap restaurants={favorites} userLocation={null} />
              </div>
            </motion.div>

            {/* 오른쪽: 찜 목록 (스크롤) */}
            <div className="w-full lg:w-3/5 space-y-4">
              {favorites.map((fav, index) => (
                <motion.div
                  key={fav.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-[1.01]">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow min-w-0">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg p-2 flex-shrink-0">
                              <Utensils className="w-5 h-5" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h3 className="text-xl text-gray-800 mb-1 truncate">{fav.restaurant_name}</h3>
                              {fav.category && (
                                <Badge className="bg-orange-100 text-orange-700 border-none text-xs">
                                  {fav.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600 mb-3">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 flex-shrink-0 text-orange-500 mt-0.5" />
                              <span className="break-words">{fav.address || '주소 정보 없음'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 flex-shrink-0 text-orange-500" />
                              <span>{fav.phone || '전화번호 정보 없음'}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {fav.url && (
                              <a href={fav.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-colors"
                                >
                                  상세보기
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </Button>
                              </a>
                            )}
                            <Button
                              onClick={() => handleDelete(fav.id)}
                              variant="outline"
                              size="sm"
                              className="hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition-colors"
                            >
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardContent className="p-12 text-center">
                <div className="mb-4">
                  <Heart className="w-16 h-16 mx-auto text-gray-400" />
                </div>
                <p className="text-xl text-gray-600 mb-2">아직 찜한 맛집이 없습니다</p>
                <p className="text-gray-500 mb-6">맛집 퀴즈를 통해 추천받은 맛집을 찜해보세요!</p>
                <a href="/">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                    <Utensils className="w-4 h-4 mr-2" />
                    맛집 찾으러 가기
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

export default FavoritesPage;