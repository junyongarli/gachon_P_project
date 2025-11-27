import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Utensils, Sparkles, ChefHat, Heart, Map, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
      
      {/* 배경 장식 요소 */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* 히어로 섹션 */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center py-20">
          {/* 메인 아이콘 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-2xl opacity-50"></div>
              <div className="relative bg-white p-8 rounded-full shadow-2xl">
                <ChefHat className="w-20 h-20 text-orange-500" />
              </div>
            </div>
          </motion.div>

          {/* 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-500" />
              <h1 className="text-6xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                맛집 추천 AI
              </h1>
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </div>
            
            {user ? (
              <p className="text-xl text-gray-600">
                환영합니다, <span className="text-orange-600">{user.username}</span>님! 오늘은 어떤 맛집을 찾아드릴까요?
              </p>
            ) : (
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                AI가 당신의 취향을 학습하여<br />완벽한 맛집을 찾아드립니다
              </p>
            )}
          </motion.div>

          {/* CTA 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-12 flex flex-col sm:flex-row gap-4"
          >
            <Link to="/quiz">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 px-10 py-6 text-lg"
              >
                <Utensils className="w-5 h-5 mr-2" />
                AI 퀴즈 시작하기
              </Button>
            </Link>
            <Link to="/smart-search">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 px-10 py-6 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                스마트 검색
              </Button>
            </Link>
          </motion.div>

          {/* 기능 카드들 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col gap-6 w-full max-w-2xl"
          >
            {/* AI 퀴즈 카드 */}
            <Link to="/quiz" className="block">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl text-gray-800 mb-1">AI 퀴즈 추천</h3>
                    <p className="text-gray-600">
                      8가지 질문으로 취향 분석 완료
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* 스마트 검색 카드 */}
            <Link to="/smart-search" className="block">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-blue-200/40 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-500 w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl text-gray-800 mb-1">스마트 검색</h3>
                    <p className="text-gray-600">
                      AI와 대화하며 거리·경로 확인
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
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

export default HomePage;