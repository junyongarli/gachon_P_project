import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true); // ✅ 로딩 상태 추가 (초기값 true)

  const navigate = useNavigate();
  
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (e) {
      console.error("인증 정보 로딩 실패", e);
    } finally {
      setIsLoading(false); // ✅ 정보 로딩이 끝나면 false로 변경
    }
  }, []); // 앱이 처음 시작될 때 한번만 실행

  const login = (userData, userToken) => {
    // ... (login 함수는 그대로)
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setUser(userData);
    setToken(userToken);
    navigate('/');
  };

  const logout = () => {
    // ... (logout 함수는 그대로)
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const value = { user, token, isLoading, login, logout }; // ✅ isLoading을 value에 추가

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}