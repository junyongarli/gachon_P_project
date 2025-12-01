import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

function AdminRoute() {
  const { user, isLoading } = useAuth();

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">권한을 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 로그인하지 않았거나 관리자가 아닌 경우
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  // 관리자인 경우 하위 라우트 렌더링
  return <Outlet />;
}

export default AdminRoute;
