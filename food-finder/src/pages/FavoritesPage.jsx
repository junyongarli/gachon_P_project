import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, ExternalLink } from 'lucide-react';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return;
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

  if (isLoading) return <div>찜한 맛집 목록을 불러오는 중...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">찜한 맛집 목록</h1>
      {favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map((fav) => (
            <Card key={fav.id}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold">{fav.restaurant_name}</h3>
                <div className="space-y-2 text-sm text-gray-600 mt-3">
                  <div className="flex items-center"><MapPin className="w-4 h-4 mr-2"/><span>{fav.address}</span></div>
                  <div className="flex items-center"><Phone className="w-4 h-4 mr-2"/><span>{fav.phone || '번호 없음'}</span></div>
                  <a href={fav.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><ExternalLink className="w-4 h-4 mr-2"/><span>상세 정보 보기</span></a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>아직 찜한 맛집이 없습니다.</p>
      )}
    </div>
  );
}

export default FavoritesPage;