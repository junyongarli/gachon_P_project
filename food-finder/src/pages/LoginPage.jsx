import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { ChefHat, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

function LoginPage() {
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (response.ok) {
        login(data.user, data.access_token);
        // 로그인 성공 시 홈 화면으로 이동
        navigate('/');
      } else {
        setError(data.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError('서버와 통신 중 또는 응답 분석 중 오류가 발생했습니다.');
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
              <ChefHat className="w-16 h-16 text-orange-500" />
            </div>
          </div>
        </motion.div>

        <Card className="bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <CardTitle className="text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                로그인
              </CardTitle>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            <CardDescription className="text-gray-600">
              맛집 추천 AI에 오신 것을 환영합니다
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="grid gap-5">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="grid gap-2"
              >
                <Label htmlFor="email" className="text-gray-700">이메일</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="이메일을 입력하세요"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white border-2 border-orange-200 rounded-lg focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:border-orange-400 transition-all"
                  required 
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="grid gap-2"
              >
                <Label htmlFor="password" className="text-gray-700">비밀번호</Label>
                <Input 
                  id="password" 
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
                transition={{ delay: 0.5 }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                  disabled={isLoading}
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </Button>
              </motion.div>
            </form>
            
            {/* 비밀번호 찾기 링크 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mt-4 text-center"
            >
              <Link 
                to="/forgot-password" 
                className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-sm"
            >
              <span className="text-gray-600">계정이 없으신가요?</span>{' '}
              <Link to="/signup" className="text-orange-600 font-semibold hover:text-orange-700 underline transition-colors">
                회원가입
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

export default LoginPage;