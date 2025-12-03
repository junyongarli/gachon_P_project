import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // JWT 토큰의 만료 시간을 확인하는 함수 (라이브러리 없이 구현)
  const isTokenExpired = (token) => {
    try {
      if (!token) return true;
      
      // JWT는 '.'으로 3부분으로 나뉩니다 (Header.Payload.Signature)
      const base64Url = token.split('.')[1]; 
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const { exp } = JSON.parse(jsonPayload); // 만료 시간(초 단위) 추출
      const currentTime = Date.now() / 1000; // 현재 시간(초 단위)

      return exp < currentTime; // 만료 시간이 지났으면 true
    } catch (error) {
      return true; // 파싱 에러나면 만료된 것으로 간주
    }
  };

  // 초기화: 새로고침 시 토큰 확인
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        if (isTokenExpired(storedToken)) {
          // 토큰이 만료되었으면 로그아웃 처리
          console.log('토큰이 만료되어 자동 로그아웃됩니다.');
          logout();
          alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
        } else {
          // 유효하면 상태 복구
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // 로그아웃 시 메인 페이지나 로그인 페이지로 이동 (선택 사항)
    window.location.href = '/login'; 
  };

  // [추가 기능] API 요청 시 401(만료) 에러가 뜨면 자동 로그아웃 시키는 fetch 래퍼
  // 페이지들에서 fetch 대신 이 함수를 쓸 수도 있습니다.
  const authFetch = async (url, options = {}) => {
    // 헤더에 토큰 자동 추가
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        // 401 Unauthorized 응답이 오면 토큰 만료로 간주하고 로그아웃
        logout();
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
        return null;
    }

    return response;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, authFetch }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);