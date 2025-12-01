import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 개발용 관리자 로그인 버튼
 * 클릭 시 즉시 관리자로 로그인하고 관리자 패널로 이동
 */
function DevAdminButton() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // 이미 관리자로 로그인된 경우 버튼 숨김
  if (user?.role === 'admin') {
    return null;
  }

  const handleClick = () => {
    // 개발용 관리자 계정으로 즉시 로그인
    const adminUser = {
      id: 999,
      username: '관리자',
      email: 'admin@foodfinder.com',
      role: 'admin',
    };
    const fakeToken = 'dev-admin-token-' + Date.now();
    
    // 로그인 처리
    login(adminUser, fakeToken);
    
    // 관리자 패널로 즉시 이동
    setTimeout(() => {
      navigate('/admin');
    }, 100);
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 h-14 px-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
    >
      <Shield className="h-5 w-5 text-white" />
      <span className="text-white font-medium">관리자 로그인</span>
    </Button>
  );
}

export default DevAdminButton;
