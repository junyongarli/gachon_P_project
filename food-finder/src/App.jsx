import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import AdminRoute from './components/AdminRoute';
import FavoritesPage from './pages/FavoritesPage';
import MapViewPage from './pages/MapViewPage';
import SearchPage from './pages/SearchPage';
import ReviewPage from './pages/ReviewPage';
import CustomerServicePage from './pages/CustomerServicePage';
import SettingsPage from './pages/SettingsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DevAdminButton from './components/DevAdminButton';

// 관리자 페이지 임포트
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminAI from './pages/admin/AdminAI';
import AdminCommunity from './pages/admin/AdminCommunity';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminSettings from './pages/admin/AdminSettings';

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
        <Route path="/signup" element={<><Navbar /><SignupPage /></>} />
        <Route path="/login" element={<><Navbar /><LoginPage /></>} />
        <Route path="/forgot-password" element={<><Navbar /><ForgotPasswordPage /></>} />
        <Route path="/favorites" element={<><Navbar /><FavoritesPage /></>} />
        <Route path="/map" element={<><Navbar /><MapViewPage /></>} />
        <Route path="/search" element={<><Navbar /><SearchPage /></>} />
        <Route path="/reviews" element={<><Navbar /><ReviewPage /></>} />
        <Route path="/customer-service" element={<><Navbar /><CustomerServicePage /></>} />
        <Route path="/settings" element={<><Navbar /><SettingsPage /></>} />
        
        {/* 관리자 전용 라우트 (중첩 라우팅, Navbar 없음) */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="ai" element={<AdminAI />} />
            <Route path="community" element={<AdminCommunity />} />
            <Route path="statistics" element={<AdminStatistics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;