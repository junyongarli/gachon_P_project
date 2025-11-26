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
        
        // 실제 API 호출 (주석 처리)
        // const response = await fetch('/api/admin/users', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // });
        // if (!response.ok) {
        //   const errorData = await response.json();
        //   throw new Error(errorData.message || '데이터를 불러오는데 실패했습니다.');
        // }
        // const data = await response.json();
        // setUsers(data.users);

        // 목업 데이터
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        setUsers([
          { id: 1, username: '홍길동', email: 'hong@example.com', role: 'user', status: 'active', joinDate: '2024-01-15' },
          { id: 2, username: '김철수', email: 'kim@example.com', role: 'owner', status: 'active', joinDate: '2024-02-20' },
          { id: 3, username: '이영희', email: 'lee@example.com', role: 'user', status: 'active', joinDate: '2024-03-10' },
          { id: 4, username: '박민수', email: 'park@example.com', role: 'owner', status: 'suspended', joinDate: '2024-01-25' },
          { id: 5, username: '최지원', email: 'choi@example.com', role: 'admin', status: 'active', joinDate: '2024-01-01' },
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      setIsLoading(false);
      setError("로그인이 필요하거나 토큰 정보가 없습니다.");
    }
  }, [token]);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'destructive',
      owner: 'default',
      user: 'secondary',
    };
    const labels = {
      admin: '관리자',
      owner: '시설자',
      user: '일반',
    };
    return <Badge variant={variants[role]}>{labels[role]}</Badge>;
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <Badge variant="outline" className="border-green-500 text-green-600">
        활성
      </Badge>
    ) : (
      <Badge variant="outline" className="border-red-500 text-red-600">
        정지
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">사용자 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center text-red-500">
          <p>에러: {error}</p>
        </div>
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
            시설자 관리
          </h1>
          <p className="text-muted-foreground">
            전체 사용자 및 시설자 계정 관리
          </p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
          <UserPlus className="mr-2 h-4 w-4" />
          사용자 추가
        </Button>
      </motion.div>

      {/* 검색 및 필터 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="사용자 이름 또는 이메일 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 사용자 테이블 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle>
              전체 사용자 ({filteredUsers.length}명)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>사용자 이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>역할</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Ban className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminUsers;
