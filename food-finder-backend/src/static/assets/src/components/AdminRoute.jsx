import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

function AdminRoute() {
  const { user, isLoading } = useAuth(); // ✅ isLoading 상태를 가져옵니다.

  // ✅ 로딩 중이면, "로딩 중..." 메시지를 보여주고 아무것도 하지 않습니다.
  if (isLoading) {
    return <div>인증 정보를 확인하는 중...</div>;
  }

  // 로딩이 끝난 후, 사용자가 없거나 관리자가 아니면 홈페이지로 보냅니다.
  if (!user || user.role !== 'admin') {
    // alert('접근 권한이 없습니다.'); // alert는 UX를 해칠 수 있어 일단 주석 처리
    return <Navigate to="/" replace />;
  }

  // 로딩이 끝났고, 관리자가 맞으면 페이지를 보여줍니다.
  return <Outlet />;
}

export default AdminRoute;