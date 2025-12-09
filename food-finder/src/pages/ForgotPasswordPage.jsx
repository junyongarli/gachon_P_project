import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion'; // motion/react 대신 framer-motion 사용 권장 (또는 기존 유지)
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // 토스트 메시지 사용

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('이메일을 입력해주세요.');
      return;
    }

    if (!email.includes('@')) {
      toast.error('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 백엔드 API 호출
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true); // 성공 화면으로 전환
        toast.success('임시 비밀번호가 발송되었습니다.');
      } else {
        toast.error(data.message || '발송 실패');
      }
    } catch (error) {
      console.error(error);
      toast.error('서버 연결 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
      
      {/* 배경 장식 요소 */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4">
              {isSubmitted ? (
                <Mail className="w-8 h-8 text-orange-500" />
              ) : (
                <KeyRound className="w-8 h-8 text-orange-500" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSubmitted ? '메일 전송 완료' : '비밀번호 찾기'}
            </h1>
            <p className="text-gray-600">
              {isSubmitted 
                ? '임시 비밀번호가 메일로 전송되었습니다.' 
                : '가입하신 이메일로 임시 비밀번호를 보내드립니다.'}
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-orange-100">
            <CardContent className="p-6">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일 주소</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md hover:shadow-lg transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        전송 중...
                      </>
                    ) : (
                      '임시 비밀번호 받기'
                    )}
                  </Button>
                </form>
              ) : (
                // [전송 성공 화면] - 디자인 유지하되 텍스트만 변경
                <div className="text-center space-y-6 py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex justify-center"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </motion.div>
                  
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{email}</p>
                    <p className="text-sm text-gray-600">
                      위 이메일로 <strong>임시 비밀번호</strong>를 보냈습니다.<br/>
                      로그인 후 반드시 비밀번호를 변경해주세요.
                    </p>
                  </div>

                  <div className="pt-2 space-y-3">
                    <Button 
                      asChild 
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      <Link to="/login">로그인 하러 가기</Link>
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setIsSubmitted(false);
                        setEmail('');
                      }}
                      variant="outline"
                      className="w-full hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
                    >
                      다른 이메일로 재전송
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 하단 링크 */}
          {!isSubmitted && (
            <div className="text-center mt-6">
              <Link to="/login" className="text-gray-600 hover:text-orange-600 transition-colors flex items-center justify-center gap-2 text-sm">
                <ArrowLeft className="w-4 h-4" /> 로그인으로 돌아가기
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* CSS 애니메이션 (기존 유지) */}
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

export default ForgotPasswordPage;