import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext'; // 우리가 만든 useAuth hook 임포트

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth(); // AuthContext에서 login 함수 가져오기

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

      // 1. 응답을 JSON이 아닌 일반 텍스트로 먼저 받습니다. (더 안정적인 방법)
      const responseText = await response.text();

      // 2. 텍스트를 수동으로 JSON 객체로 변환합니다.
      const data = JSON.parse(responseText);

      // 3. 백엔드가 성공 신호(2xx 상태 코드)를 보냈는지 확인합니다.
      if (response.ok) {
        // 성공했다면 로그인 함수를 호출합니다.
        login(data.user, data.access_token);
      } else {
        // 실패했다면 서버가 보낸 에러 메시지를 표시합니다.
        setError(data.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      // 네트워크 연결 자체에 실패했거나, 받은 텍스트가 JSON이 아닐 때 이 에러가 발생합니다.
      setError('서버와 통신 중 또는 응답 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>계정에 로그인하기 위해 이메일을 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="underline">회원가입</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;