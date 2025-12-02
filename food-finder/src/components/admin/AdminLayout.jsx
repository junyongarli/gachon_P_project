import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Users, MessageSquare, Settings, LogOut, Bell, HelpCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const menuItems = [
    { path: '/admin/users', icon: Users, label: '사용자 정보 관리' },
    { path: '/admin/system', icon: Settings, label: '시스템 관리' },
    {
      path: '/admin/community',
      icon: MessageSquare,
      label: '커뮤니티 관리',
      subMenu: [
        { path: '/admin/community/notices', icon: Bell, label: '공지사항 관리' },
        { path: '/admin/community/inquiries', icon: HelpCircle, label: '문의사항 관리' },
      ],
    },
  ];

  const isMenuActive = (item) => {
    if (item.subMenu) {
      return item.subMenu.some((sub) => location.pathname.startsWith(sub.path));
    }
    return location.pathname === item.path;
  };

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
              맛맵 관리자
            </h2>
            <p className="text-muted-foreground">Admin Panel</p>
          </div>

          {/* 메뉴 */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => item.subMenu && setHoveredMenu(item.path)}
                onMouseLeave={() => item.subMenu && setHoveredMenu(null)}
                className="relative"
              >
                {item.subMenu ? (
                  // 서브메뉴가 있는 경우
                  <>
                    <div
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all cursor-pointer ${
                        isMenuActive(item)
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-orange-50'
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 ${
                          isMenuActive(item) ? 'text-white' : 'text-orange-600'
                        }`}
                      />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          hoveredMenu === item.path ? 'rotate-90' : ''
                        }`}
                      />
                    </div>

                    {/* 서브메뉴 드롭다운 */}
                    <AnimatePresence>
                      {hoveredMenu === item.path && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-4 mt-1 space-y-1 overflow-hidden"
                        >
                          {item.subMenu.map((subItem) => (
                            <NavLink
                              key={subItem.path}
                              to={subItem.path}
                              className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all ${
                                  isActive
                                    ? 'bg-orange-100 text-orange-700 font-medium'
                                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                }`
                              }
                            >
                              <subItem.icon className="h-4 w-4" />
                              <span>{subItem.label}</span>
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  // 서브메뉴가 없는 경우
                  <NavLink
                    to={item.path}
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
                )}
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