import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx'; // AuthProvider 임포트
import { BrowserRouter as Router } from 'react-router-dom'; // Router를 여기서 감싸줍니다.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router> {/* Router를 최상단으로 이동 */}
      <AuthProvider> {/* AuthProvider로 App을 감쌉니다. */}
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>
);