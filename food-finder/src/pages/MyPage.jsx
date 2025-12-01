import { useState } from 'react';
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
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';

function MyPage() {
  const { user } = useAuth();

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
              <h1 className="text-4xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
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
              <h2 className="text-2xl text-gray-800">내 정보</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <User className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">사용자명</p>
                  <p className="text-lg text-gray-800">{user?.username || '사용자'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <Mail className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">이메일</p>
                  <p className="text-lg text-gray-800">{user?.email || 'user@example.com'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">가입일</p>
                  <p className="text-lg text-gray-800">2024년 1월</p>
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
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">찜한 맛집</p>
                  <p className="text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">0개</p>
                </div>
                <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-full">
                  <Heart className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">추천 받은 횟수</p>
                  <p className="text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">0회</p>
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