import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // ✅ 로딩 및 에러 상태를 위한 state 추가
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // 폼 제출 시 실행될 함수
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // 로딩 시작
    setError(''); // 이전 에러 메시지 초기화

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) { // HTTP 상태 코드가 2xx일 때
        alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
        navigate('/login'); // 로그인 페이지로 이동
      } else {
        // 서버에서 보낸 에러 메시지를 표시
        setError(data.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      // 네트워크 에러 등
      setError('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>
            계정을 만들기 위해 아래 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* ... (Input 필드들은 변경 없음) ... */}
            <div className="grid gap-2">
              <Label htmlFor="username">사용자 이름</Label>
              <Input id="username" type="text" placeholder="홍길동" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {/* ✅ 에러 메시지를 표시하는 부분 */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* ✅ 로딩 중일 때 버튼 비활성화 */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '처리 중...' : '계정 생성하기'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="underline">
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupPage;