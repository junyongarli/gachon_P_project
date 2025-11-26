import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ChefHat, User, LogOut, MapPin, Search, MessageSquare, Settings, HelpCircle, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative z-20 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              맛집 추천 AI
            </span>
          </Link>

          {/* 네비게이션 메뉴 */}
          <div className="flex items-center gap-2">
            {/* 주요 메뉴 */}
            <Link to="/map">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                <MapPin className="w-4 h-4 mr-2" />
                지도
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                <Search className="w-4 h-4 mr-2" />
                검색
              </Button>
            </Link>
            <Link to="/reviews">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                <MessageSquare className="w-4 h-4 mr-2" />
                리뷰
              </Button>
            </Link>

            {user ? (
              <>
                <Link to="/favorites">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                    <Heart className="w-4 h-4 mr-2" />
                    찜 목록
                  </Button>
                </Link>
                
                {/* 사용자 메뉴 드롭다운 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                      <User className="w-4 h-4 mr-2" />
                      {user.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {user.role === 'admin' && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center cursor-pointer">
                            <Shield className="w-4 h-4 mr-2 text-orange-600" />
                            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">관리자 패널</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        설정
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/customer-service" className="flex items-center cursor-pointer">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        고객센터
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                    로그인
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                    회원가입
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;