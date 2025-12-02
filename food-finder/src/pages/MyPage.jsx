import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail,
  Calendar,
  Settings,
  Heart,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion'; // motion/react -> framer-motion 권장
import { useAuth } from '@/contexts/AuthContext';

function MyPage() {
  const { user, token } = useAuth(); // token 가져오기
  const [favoritesCount, setFavoritesCount] = useState(0); // 찜 개수 상태

  // [추가] 찜 목록 개수 불러오기
  useEffect(() => {
    const fetchMyData = async () => {
      if (!token) return;

      try {
        // 찜 목록 API 호출
        const response = await fetch('/api/favorites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
          // 리스트의 길이(=개수)를 저장
          setFavoritesCount(data.favorites.length);
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };

    fetchMyData();
  }, [token]);

  // 날짜 포맷팅 함수 (예: 2024년 1월 1일)
  const formatDate = (dateString) => {
    if (!dateString) return '2024년 1월'; // 기본값
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
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
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold">
                마이페이지
              </h1>
              <p className="text-gray-600 mt-1">{user?.username}님 환영합니다</p>
            </div>
          </div>
        </motion.div>

        {/* 사용자 정보 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <CardHeader>
              <h2 className="text-2xl text-gray-800 font-bold">내 정보</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <User className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">사용자명</p>
                  <p className="text-lg text-gray-800 font-medium">{user?.username || '사용자'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <Mail className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">이메일</p>
                  <p className="text-lg text-gray-800 font-medium">{user?.email || 'user@example.com'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">가입일</p>
                  <p className="text-lg text-gray-800 font-medium">
                    {user?.createdAt ? formatDate(user.createdAt) : '2024년 1월'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 활동 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
        >
          {/* 찜한 맛집 개수 카드 */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">찜한 맛집</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {favoritesCount}개
                  </p>
                </div>
                <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-full">
                  <Heart className="w-8 h-8 text-orange-600 fill-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">추천 받은 횟수</p>
                  {/* 이 부분은 아직 백엔드에 로직이 없으므로 0회 유지 또는 추후 구현 */}
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    0회
                  </p>
                </div>
                <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-full">
                  <Star className="w-8 h-8 text-orange-600" />
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

export default MyPage;