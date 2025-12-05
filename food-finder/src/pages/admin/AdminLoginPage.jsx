// src/pages/admin/AdminLoginPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Sparkles, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // [수정] 관리자 전용 로그인 API 호출
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // [이중 체크] 토큰 내 정보를 확인하거나 응답값 확인
        if (data.user.role !== 'admin') {
          setError('관리자 권한이 없는 계정입니다.');
          return;
        }
        
        login(data.user, data.access_token);
        // 관리자 페이지로 이동
        navigate('/admin');
      } else {
        // API 에러 메시지 표시
        setError(data.message || '관리자 로그인에 실패했습니다.');
        
        // (개발용: 백엔드 연결 실패 시 목업 처리 유지)
        if (!response.ok && response.status !== 401 && response.status !== 403) {
             console.warn('⚠️ 백엔드 API 응답 오류 - 목업 데이터로 로그인 시도 (개발용)');
             // 실제 배포 시에는 이 부분 제거 권장
             if (email === 'admin@matmap.com' && password === 'admin123') {
                 const mockAdminUser = {
                   id: 1,
                   email: 'admin@matmap.com',
                   name: '관리자',
                   role: 'admin'
                 };
                 const mockToken = 'mock-admin-token-' + Date.now();
                 login(mockAdminUser, mockToken);
                 navigate('/admin');
             }
        }
      }
    } catch (err) {
      // 네트워크 오류 시 처리
      console.warn('⚠️ 서버 연결 실패:', err.message);
      setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
      
      {/* 배경 장식 요소 */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* 관리자 배지 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg">
            <Shield className="w-4 h-4" />
            <span className="text-sm">관리자 전용</span>
          </div>
        </motion.div>

        {/* 로고 아이콘 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-lg opacity-50"></div>
            <div className="relative bg-white p-6 rounded-full shadow-xl">
              <Shield className="w-16 h-16 text-orange-500" />
            </div>
          </div>
        </motion.div>

        <Card className="bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <CardTitle className="text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                관리자 로그인
              </CardTitle>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            <CardDescription className="text-gray-600">
              맛맵 관리자 패널에 접속합니다
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {/* 경고 메시지 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="mb-1">이 페이지는 관리자 전용입니다.</p>
                  <p className="text-gray-600">일반 사용자는 <Link to="/login" className="text-orange-600 hover:underline">사용자 로그인</Link>을 이용해주세요.</p>
                </div>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="grid gap-5">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="grid gap-2"
              >
                <Label htmlFor="admin-email" className="text-gray-700">관리자 이메일</Label>
                <Input 
                  id="admin-email" 
                  type="email" 
                  placeholder="admin@matmap.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white border-2 border-orange-200 rounded-lg focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:border-orange-400 transition-all"
                  required 
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="grid gap-2"
              >
                <Label htmlFor="admin-password" className="text-gray-700">비밀번호</Label>
                <Input 
                  id="admin-password" 
                  type="password" 
                  placeholder="비밀번호를 입력하세요"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-white border-2 border-orange-200 rounded-lg focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:border-orange-400 transition-all"
                  required 
                />
              </motion.div>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  {error}
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                  disabled={isLoading}
                >
                  {isLoading ? '로그인 중...' : (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>관리자 로그인</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center text-sm"
            >
              <Link to="/" className="text-gray-600 hover:text-orange-600 transition-colors">
                ← 메인 페이지로 돌아가기
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

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

export default AdminLoginPage;