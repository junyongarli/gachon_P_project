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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, UserPlus, MoreVertical, Mail, Shield, Ban, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { token } = useAuth();

  // 사용자 목록 불러오기
  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // 백엔드 응답 구조 대응
        if (data.success && Array.isArray(data.users)) {
             setUsers(data.users);
        } else if (Array.isArray(data)) {
             setUsers(data);
        } else {
             setUsers([]); 
        }
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

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  // [추가] 상태 변경 핸들러
  const handleStatusChange = async (userId, newStatus) => {
    if (!confirm(`사용자 상태를 '${newStatus === 'active' ? '활성' : '정지'}'로 변경하시겠습니까?`)) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // UI만 업데이트 (새로고침 없이)
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ));
      } else {
        alert('상태 변경에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    }
  };

  // [추가] 사용자 삭제 핸들러
  const handleDeleteUser = async (userId) => {
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // 목록에서 제거
        setUsers(users.filter(user => user.id !== userId));
      } else {
        const data = await response.json();
        alert(data.message || '삭제 실패');
      }
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role) => {
    if (role === 'admin') return <Badge className="bg-purple-500">관리자</Badge>;
    if (role === 'owner') return <Badge className="bg-blue-500">시설자</Badge>;
    return <Badge variant="secondary">일반</Badge>;
  };

  const getStatusBadge = (status) => {
    if (status === 'suspended') return <Badge variant="destructive">정지</Badge>;
    return <Badge className="bg-green-500 hover:bg-green-600">활성</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 및 통계 카드 (기존 코드 유지) */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent text-2xl font-bold">사용자 관리</h1>
          <p className="text-muted-foreground">전체 사용자 계정 관리</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
          <UserPlus className="mr-2 h-4 w-4" /> 사용자 추가
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">전체 사용자</CardTitle><Mail className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{users.length}명</div></CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">관리자</CardTitle><Shield className="h-4 w-4 text-purple-500" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}명</div></CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">정지된 계정</CardTitle><Ban className="h-4 w-4 text-red-500" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{users.filter(u => u.status === 'suspended').length}명</div></CardContent>
        </Card>
      </motion.div>

      {/* 검색 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><Search className="h-5 w-5 text-muted-foreground" /><Input placeholder="사용자 이름 또는 이메일로 검색..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-md" /></div></CardContent></Card>
      </motion.div>

      {/* 테이블 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
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
                  <TableRow><TableCell colSpan={6} className="text-center py-8">검색 결과가 없습니다.</TableCell></TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status || 'active')}</TableCell>
                      <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '-'}</TableCell>
                      <TableCell className="text-right">
                        
                        {/* ▼ [수정] 드롭다운 메뉴로 변경된 작업 버튼 */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>계정 관리</DropdownMenuLabel>
                            
                            {/* 상태 변경 옵션 */}
                            {user.status === 'suspended' ? (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                    <span>활성화 해제</span>
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'suspended')}>
                                    <AlertCircle className="mr-2 h-4 w-4 text-orange-500" />
                                    <span>계정 정지</span>
                                </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            {/* 삭제 옵션 */}
                            <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600 focus:text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>계정 삭제</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

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