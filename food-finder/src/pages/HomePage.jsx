import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext'; // useAuth hook 임포트

function HomePage() {
  const { user, logout } = useAuth(); // Context에서 user 정보와 logout 함수 가져오기

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">맛집 추천 AI</h1>
      
      {/* ✅ 로그인 상태에 따라 다른 메시지 표시 */}
      {user ? (
        <p className="text-lg text-gray-600 mb-8">
          환영합니다, {user.username}님!
        </p>
      ) : (
        <p className="text-lg text-gray-600 mb-8">
          당신의 취향을 학습하여 최고의 맛집을 찾아드립니다.
        </p>
      )}

      <div className="space-x-4">
        <Link to="/quiz">
          <Button size="lg">맛집 찾기 시작</Button>
        </Link>
        
        {/* ✅ 로그인 상태에 따라 다른 버튼 표시 */}
        {user ? (
          <Button onClick={logout} size="lg" variant="outline">로그아웃</Button>
        ) : (
          <Link to="/login">
            <Button size="lg" variant="outline">로그인</Button>
          </Link>
        )}
      </div>

      {/* ✅ 로그인하지 않았을 때만 회원가입 링크 표시 */}
      {!user && (
        <div className="mt-4 text-sm">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="underline font-semibold text-primary">
            회원가입
          </Link>
        </div>
      )}
    </div>
  );
}

export default HomePage;