import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, UserPlus, MoreVertical, Mail, Shield, Ban } from 'lucide-react';
import { motion } from 'motion/react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError('');
      try {
        console.log("API 요청 직전 토큰:", token);
        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log("응답 상태:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("받아온 사용자 데이터:", data);
          setUsers(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || '사용자 목록을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error("사용자 목록 불러오기 오류:", err);
        setError('서버와 통신 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return <Badge className="bg-gradient-to-r from-purple-500 to-purple-600">관리자</Badge>;
    } else if (role === 'owner') {
      return <Badge className="bg-gradient-to-r from-blue-500 to-blue-600">시설자</Badge>;
    } else {
      return <Badge variant="secondary">일반</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <Badge className="bg-green-500">활성</Badge>;
    } else if (status === 'suspended') {
      return <Badge className="bg-red-500">정지</Badge>;
    } else {
      return <Badge variant="outline">대기</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">사용자 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>다시 시도</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            사용자 관리
          </h1>
          <p className="text-muted-foreground">
            전체 사용자 계정 관리
          </p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
          <UserPlus className="mr-2 h-4 w-4" />
          사용자 추가
        </Button>
      </motion.div>

      {/* 통계 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 grid gap-4 md:grid-cols-3"
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground">전체 사용자</CardTitle>
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2">
              <Mail className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div>{users.length}명</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground">관리자</CardTitle>
            <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-2">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div>{users.filter(u => u.role === 'admin').length}명</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground">정지된 계정</CardTitle>
            <div className="rounded-lg bg-gradient-to-br from-red-500 to-red-600 p-2">
              <Ban className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div>{users.filter(u => u.status === 'suspended').length}명</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 검색 및 필터 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="사용자 이름 또는 이메일로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 사용자 테이블 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>사용자명</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>역할</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {searchQuery ? '검색 결과가 없습니다.' : '사용자가 없습니다.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status || 'active')}</TableCell>
                      <TableCell>
                        {user.created_at 
                          ? new Date(user.created_at).toLocaleDateString('ko-KR')
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminUsers;
