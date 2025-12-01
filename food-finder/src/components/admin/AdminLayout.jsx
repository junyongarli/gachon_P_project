import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Users, Bell, Brain, MessageSquare, BarChart3, Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/admin/users', icon: Users, label: '사용자 관리' },
    { path: '/admin/notifications', icon: Bell, label: '시설자 알림 관리' },
    { path: '/admin/ai', icon: Brain, label: 'AI모델 관리' },
    { path: '/admin/community', icon: MessageSquare, label: '커뮤니티 관리' },
    // { path: '/admin/statistics', icon: BarChart3, label: '통계' }, // 일단 보류
    { path: '/admin/settings', icon: Settings, label: '설정' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* 사이드바 */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 border-r border-orange-100 bg-white/80 backdrop-blur-sm"
      >
        <div className="sticky top-0 p-6">
          {/* 헤더 */}
          <div className="mb-8">
            <h2 className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              관리자 패널
            </h2>
            <p className="text-muted-foreground">Food Finder Admin</p>
          </div>

          {/* 메뉴 */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-orange-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-orange-600'}`} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* 로그아웃 버튼 */}
          <motion.div
            className="mt-8 pt-6 border-t border-orange-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={() => {
                logout();
                navigate('/');
              }}
              variant="ghost"
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all justify-start"
            >
              <LogOut className="h-5 w-5" />
              <span>로그아웃</span>
            </Button>
          </motion.div>
        </div>
      </motion.aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;