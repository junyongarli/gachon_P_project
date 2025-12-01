import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, UserPlus, MoreVertical, Mail, Shield, Ban, Trash2, Edit } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError('');
      
      // 목업 데이터 (백엔드 구현 후 주석 해제)
      const mockUsers = [
        {
          id: 1,
          username: '김맛집',
          email: 'matjip@example.com',
          role: 'admin',
          status: 'active',
          created_at: '2024-01-15T09:30:00Z',
        },
        {
          id: 2,
          username: '이음식',
          email: 'foodlover@example.com',
          role: 'user',
          status: 'active',
          created_at: '2024-02-20T14:22:00Z',
        },
        {
          id: 3,
          username: '박레스토랑',
          email: 'restaurant.park@example.com',
          role: 'owner',
          status: 'active',
          created_at: '2024-03-10T11:45:00Z',
        },
        {
          id: 4,
          username: '최고객',
          email: 'customer.choi@example.com',
          role: 'user',
          status: 'suspended',
          created_at: '2024-03-25T16:10:00Z',
        },
        {
          id: 5,
          username: '정미식가',
          email: 'gourmet.jung@example.com',
          role: 'user',
          status: 'active',
          created_at: '2024-04-05T10:20:00Z',
        },
        {
          id: 6,
          username: '강레시피',
          email: 'recipe.kang@example.com',
          role: 'owner',
          status: 'active',
          created_at: '2024-04-18T13:55:00Z',
        },
        {
          id: 7,
          username: '윤요리',
          email: 'cook.yoon@example.com',
          role: 'user',
          status: 'active',
          created_at: '2024-05-02T09:15:00Z',
        },
        {
          id: 8,
          username: '임배달',
          email: 'delivery.lim@example.com',
          role: 'user',
          status: 'suspended',
          created_at: '2024-05-12T17:40:00Z',
        },
      ];

      // 목업 데이터 사용 (개발 중)
      setTimeout(() => {
        setUsers(mockUsers);
        setIsLoading(false);
      }, 500); // 로딩 시뮬레이션

      // 실제 API 호출 (백엔드 구현 후 활성화)
      /*
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
      */
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

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast.error('모든 필드를 입력해주세요');
      return;
    }

    // TODO: API 연동 필요
    // 현재는 프론트엔드 상태만 업데이트
    const createdUser = {
      id: users.length + 1,
      ...newUser,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    setUsers([...users, createdUser]);
    setNewUser({ username: '', email: '', password: '', role: 'user' });
    setIsAddUserOpen(false);
    toast.success('사용자가 추가되었습니다');
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      return;
    }

    // TODO: API 연동 필요
    setUsers(users.filter((user) => user.id !== userId));
    toast.success('사용자가 삭제되었습니다');
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    
    // TODO: API 연동 필요
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    toast.success(`사용자 상태가 "${newStatus === 'active' ? '활성' : '정지'}"로 변경되었습니다`);
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
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <UserPlus className="mr-2 h-4 w-4" />
              사용자 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 사용자 등록</DialogTitle>
              <DialogDescription>
                새로운 사용자 계정을 생성합니다
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">사용자명</Label>
                <Input
                  id="username"
                  placeholder="사용자명 입력"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일 입력"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호 입력"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">역할</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">일반 사용자</SelectItem>
                    <SelectItem value="owner">시설자</SelectItem>
                    <SelectItem value="admin">관리자</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddUser}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                사용자 등록
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>작업</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              정보 수정
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(user.id, user.status || 'active')}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              {(user.status || 'active') === 'active' ? '계정 정지' : '정지 해제'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              계정 삭제
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
