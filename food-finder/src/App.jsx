import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import SignupPage from './pages/SignupPage'; // 이전 단계에서 만든 파일
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage'; // AdminPage 임포트
import AdminRoute from './components/AdminRoute'; // AdminRoute 임포트

function App() {
  return (
    <Routes>
      {/* 일반 사용자 라우트 */}
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* ▼▼▼ 관리자 전용 라우트 ▼▼▼ */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      {/* ▲▲▲ 관리자 전용 라우트 ▲▲▲ */}
    </Routes>
  );
}

export default App;