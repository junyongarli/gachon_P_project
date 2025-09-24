import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  // ▼▼▼ useEffect 부분을 아래 코드로 수정합니다 ▼▼▼
  useEffect(() => {
    const fetchUsers = async () => {
      // 로딩 상태를 다시 true로 설정
      setIsLoading(true);
      setError('');
      try {
        // ▼▼▼ 여기에 console.log를 추가합니다 ▼▼▼
        console.log("API 요청 직전 토큰:", token); 
        // ▲▲▲ 이 코드가 핵심입니다 ▲▲▲
        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '데이터를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // ✅ 토큰이 있을 때만 fetchUsers 함수를 호출합니다.
    if (token) {
      fetchUsers();
    } else {
      // 토큰이 없는 경우 (예: 페이지 새로고침 후 아직 로딩 중일 때)
      setIsLoading(false);
      setError("로그인이 필요하거나 토큰 정보가 없습니다.");
    }
  }, [token]); // token이 변경될 때마다 이 useEffect가 다시 실행됩니다.
  // ▲▲▲ 여기까지 수정 ▲▲▲

  if (isLoading) return <div>사용자 목록을 불러오는 중...</div>;
  if (error) return <div className="text-red-500">에러: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* ... (테이블 UI 부분은 그대로 둡니다) ... */}
      <h1 className="text-2xl font-bold mb-4">관리자 페이지 - 사용자 목록</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">사용자 이름</th>
            <th className="py-2 px-4 border-b">이메일</th>
            <th className="py-2 px-4 border-b">역할</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b text-center">{user.id}</td>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b text-center">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;