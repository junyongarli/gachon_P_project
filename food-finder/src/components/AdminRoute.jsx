import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

function AdminRoute() {
  const { user, token, isLoading } = useAuth(); // token 추가

  // 1. 로딩 중일 때 (토큰 검증 등)
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">권한 확인 중...</p>
        </div>
      </div>
    );
  }

  // 2. 로그인이 안 되어 있을 때 (토큰이나 유저 정보 없음) -> 로그인 페이지로
  if (!token || !user) {
    alert('관리자 로그인이 필요합니다.');
    return <Navigate to="/login" replace />;
  }

  // 3. 로그인 했으나 관리자가 아닐 때 -> 경고 후 홈으로
  if (user.role !== 'admin') {
    alert('관리자 권한이 필요합니다.');
    return <Navigate to="/" replace />;
  }

  // 4. 통과 (관리자임)
  return <Outlet />;
}

export default AdminRoute;