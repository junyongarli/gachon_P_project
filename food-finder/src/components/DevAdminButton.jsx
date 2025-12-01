import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

/**
 * 개발용 관리자 로그인 버튼
 * 클릭 시 관리자 로그인 페이지로 이동
 */
function DevAdminButton() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 이미 관리자로 로그인된 경우 버튼 숨김
  if (user?.role === 'admin') {
    return null;
  }

  const handleClick = () => {
    navigate('/admin/login');
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 h-14 px-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
    >
      <Shield className="h-5 w-5 text-white" />
      <span className="text-white font-medium">
        관리자 로그인
      </span>
    </Button>
  );
}

export default DevAdminButton;