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

<style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>