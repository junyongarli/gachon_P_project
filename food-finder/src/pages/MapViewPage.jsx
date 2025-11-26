import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Phone, ExternalLink, Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';

function MapViewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // 예시 맛집 데이터
  const mockRestaurants = [
    {
      id: 1,
      name: '맛있는 한식당',
      category: '한식',
      address: '서울시 강남구 테헤란로 123',
      phone: '02-1234-5678',
      rating: 4.5,
      latitude: 37.5665,
      longitude: 126.9780,
      isFavorite: false,
    },
    {
      id: 2,
      name: '이탈리안 레스토랑',
      category: '양식',
      address: '서울시 강남구 역삼동 456',
      phone: '02-2345-6789',
      rating: 4.8,
      latitude: 37.5675,
      longitude: 126.9790,
      isFavorite: true,
    },
    {
      id: 3,
      name: '일본식 라멘',
      category: '일식',
      address: '서울시 서초구 서초동 789',
      phone: '02-3456-7890',
      rating: 4.3,
      latitude: 37.5655,
      longitude: 126.9770,
      isFavorite: false,
    },
  ];

  const [restaurants, setRestaurants] = useState(mockRestaurants);

  // 카카오맵 초기화
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_MAP_API_KEY&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);

        // 마커 추가
        restaurants.forEach((restaurant) => {
          const markerPosition = new window.kakao.maps.LatLng(
            restaurant.latitude,
            restaurant.longitude
          );
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);

          // 마커 클릭 이벤트
          window.kakao.maps.event.addListener(marker, 'click', () => {
            setSelectedRestaurant(restaurant);
          });
        });
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [restaurants]);

  const toggleFavorite = (id) => {
    setRestaurants(
      restaurants.map((r) =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
      )
    );
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            지도로 맛집 찾기
          </h1>
          <p className="text-muted-foreground">
            지도에서 주변 맛집을 확인하고 찾아가세요
          </p>
        </motion.div>

        {/* 검색바 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="맛집 이름으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 지도 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden backdrop-blur-sm bg-white/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  지도
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  id="map"
                  className="h-[500px] w-full rounded-lg border-2 border-orange-100"
                  style={{ backgroundColor: '#f5f5f5' }}
                >
                  {/* 카카오맵이 여기에 로드됩니다 */}
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    카카오맵 API 키를 설정해주세요
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 맛집 리스트 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader>
                <CardTitle>맛집 목록</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                <div className="space-y-4">
                  {filteredRestaurants.map((restaurant, index) => (
                    <motion.div
                      key={restaurant.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedRestaurant(restaurant)}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                        selectedRestaurant?.id === restaurant.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h3>{restaurant.name}</h3>
                            <Badge variant="secondary">{restaurant.category}</Badge>
                          </div>
                          <div className="space-y-1 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{restaurant.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{restaurant.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{restaurant.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(restaurant.id);
                          }}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              restaurant.isFavorite
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </Button>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              `https://map.kakao.com/link/to/${restaurant.name},${restaurant.latitude},${restaurant.longitude}`
                            );
                          }}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          길찾기
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default MapViewPage;
