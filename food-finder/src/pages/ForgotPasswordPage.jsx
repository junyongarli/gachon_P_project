import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }

    if (!email.includes('@')) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    // TODO: API 연동
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
      
      {/* 배경 장식 요소 */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* 뒤로 가기 */}
          <Link to="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>로그인으로 돌아가기</span>
          </Link>

          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border border-white/20">
            <CardContent className="p-8">
              {!isSubmitted ? (
                <>
                  {/* 헤더 */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mb-4">
                      <KeyRound className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                      비밀번호 찾기
                    </h1>
                    <p className="text-gray-600">
                      가입하신 이메일 주소를 입력하시면<br />
                      비밀번호 재설정 링크를 보내드립니다
                    </p>
                  </div>

                  {/* 폼 */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-orange-500" />
                        <span>이메일</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="h-12"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>전송 중...</span>
                        </div>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          재설정 링크 보내기
                        </>
                      )}
                    </Button>
                  </form>

                  {/* 도움말 */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      💡 이메일이 기억나지 않으신가요?<br />
                      고객센터로 문의해주세요.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* 성공 메시지 */}
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </motion.div>
                    
                    <h2 className="text-2xl text-gray-800 mb-4">
                      이메일이 전송되었습니다!
                    </h2>
                    
                    <p className="text-gray-600 mb-2">
                      <span className="text-orange-600">{email}</span>로<br />
                      비밀번호 재설정 링크를 보내드렸습니다.
                    </p>
                    
                    <p className="text-sm text-gray-500 mb-8">
                      메일이 오지 않았다면 스팸 메일함을 확인해주세요.
                    </p>

                    <div className="space-y-3">
                      <Link to="/login" className="block">
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                          로그인 페이지로 이동
                        </Button>
                      </Link>
                      
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
                </>
              )}
            </CardContent>
          </Card>

          {/* 하단 링크 */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              계정이 없으신가요?{' '}
              <Link to="/signup" className="text-orange-600 hover:text-orange-700 hover:underline">
                회원가입
              </Link>
            </p>
          </div>
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

export default ForgotPasswordPage;
