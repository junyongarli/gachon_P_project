import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import LoginPage from './pages/LoginPage';
import AdminRoute from './components/AdminRoute';
import FavoritesPage from './pages/FavoritesPage';
import SearchPage from './pages/SearchPage';
import SmartSearchPage from './pages/SmartSearchPage'; // 스마트 검색
import ReviewPage from './pages/ReviewPage';
import NoticesPage from './pages/NoticesPage'; // 공지사항
import CustomerServicePage from './pages/CustomerServicePage';
import SettingsPage from './pages/SettingsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DevAdminButton from './components/DevAdminButton';
import SignupPage from './pages/SignupPage';

// 관리자 페이지 임포트
import AdminLayout from './components/admin/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSystem from './pages/admin/AdminSystem';
import AdminNotices from './pages/admin/AdminNotices';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import MyPage from './pages/MyPage'; // 마이페이지

function App() {
  return (
    <div className="min-h-screen">
      {/* 개발용 관리자 로그인 버튼 */}
      <DevAdminButton />
      
      {/* 페이지 라우트 */}
      <Routes>
        {/* 일반 사용자 페이지 (Navbar 포함) */}
        <Route path="/" element={<><Navbar /><HomePage /></>} />
        <Route path="/quiz" element={<><Navbar /><QuizPage /></>} />
        <Route path="/login" element={<><Navbar /><LoginPage /></>} />
        <Route path="/forgot-password" element={<><Navbar /><ForgotPasswordPage /></>} />
        <Route path="/favorites" element={<><Navbar /><FavoritesPage /></>} />
        <Route path="/search" element={<><Navbar /><SearchPage /></>} />
        <Route path="/smart-search" element={<><Navbar /><SmartSearchPage /></>} /> {/* 스마트 검색 */}
        <Route path="/reviews" element={<><Navbar /><ReviewPage /></>} />
        <Route path="/notices" element={<><Navbar /><NoticesPage /></>} /> {/* 공지사항 */}
        <Route path="/customer-service" element={<><Navbar /><CustomerServicePage /></>} />
        <Route path="/settings" element={<><Navbar /><SettingsPage /></>} />
        <Route path="/signup" element={<><Navbar /><SignupPage /></>} />
        <Route path="/mypage" element={<><Navbar /><MyPage /></>} /> {/* 마이페이지 */}
        
        {/* 관리자 전용 라우트 (중첩 라우, Navbar 없음) */}
       <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminUsers />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="system" element={<AdminSystem />} />
            <Route path="community/notices" element={<AdminNotices />} />
            <Route path="community/inquiries" element={<AdminInquiries />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;