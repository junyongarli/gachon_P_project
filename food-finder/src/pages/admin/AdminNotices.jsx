import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Bell, Plus, Trash2, Edit, Search, Eye, Printer } from 'lucide-react';
import { motion } from 'framer-motion'; 
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext'; // 토큰 가져오기

function AdminNotices() {
  const { token } = useAuth(); // 인증 토큰
  const [searchQuery, setSearchQuery] = useState('');
  
  // [수정] 초기값 빈 배열로 시작 (API로 채움)
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [noticeForm, setNoticeForm] = useState({
    title: '',
    category: '일반',
    content: '',
  });

  // 1. 공지사항 목록 불러오기 (Read)
  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/community/notices');
      const data = await response.json();
      if (data.success) {
        setNotices(data.notices);
      }
    } catch (error) {
      console.error("공지사항 로딩 에러:", error);
      toast.error("공지사항을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // 2. 공지사항 등록 (Create)
  const handleCreateNotice = async () => {
    if (!noticeForm.title || !noticeForm.content) {
      toast.error('제목과 내용을 입력해주세요');
      return;
    }

    try {
      const response = await fetch('/api/community/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 관리자 권한 증명
        },
        body: JSON.stringify(noticeForm)
      });
      
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('공지사항이 등록되었습니다');
        setNoticeForm({ title: '', category: '일반', content: '' }); // 폼 초기화
        fetchNotices(); // 목록 새로고침 (서버 데이터 다시 받기)
      } else {
        toast.error(data.message || '등록 실패');
      }
    } catch (error) {
      console.error(error);
      toast.error('서버 통신 오류');
    }
  };

  // 3. 공지사항 삭제 (Delete)
  const handleDeleteNotice = async (id) => {
    if (!confirm('정말로 이 공지사항을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/community/notices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('삭제되었습니다');
        setNotices(notices.filter((n) => n.id !== id)); // 화면에서 즉시 제거
      } else {
        toast.error(data.message || '삭제 실패');
      }
    } catch (error) {
      console.error(error);
      toast.error('삭제 중 오류 발생');
    }
  };

  const handlePrintNotice = () => {
    window.print();
  };

  const getCategoryBadge = (category) => {
    const colors = {
      점검: 'bg-blue-500',
      이벤트: 'bg-purple-500',
      정책: 'bg-gray-500',
      일반: 'bg-green-500',
    };
    return <Badge className={`${colors[category] || 'bg-gray-500'} text-white`}>{category}</Badge>;
  };

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 통계 (실제 데이터 기반)
  const noticeStats = {
    total: notices.length,
    // 오늘 등록된 공지
    new: notices.filter((n) => {
        const today = new Date().toISOString().split('T')[0];
        const noticeDate = new Date(n.createdAt).toISOString().split('T')[0];
        return today === noticeDate;
    }).length,
  };

  return (
    <div>
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          공지사항 관리
        </h1>
        <p className="text-muted-foreground">
          사용자에게 공지할 내용을 작성하고 관리합니다
        </p>
      </motion.div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {[
          { label: '전체 공지', value: noticeStats.total, icon: Bell, color: 'from-blue-500 to-blue-600' },
          { label: '오늘 등록', value: noticeStats.new, icon: Plus, color: 'from-orange-500 to-orange-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-2`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 공지사항 작성 폼 */}
      <Card className="backdrop-blur-sm bg-white/80 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            새 공지사항 작성
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notice-title">제목</Label>
              <Input
                id="notice-title"
                placeholder="공지사항 제목을 입력하세요"
                value={noticeForm.title}
                onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="notice-category">카테고리</Label>
              <Select
                value={noticeForm.category}
                onValueChange={(value) => setNoticeForm({ ...noticeForm, category: value })}
              >
                <SelectTrigger id="notice-category">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="일반">일반</SelectItem>
                  <SelectItem value="점검">점검</SelectItem>
                  <SelectItem value="이벤트">이벤트</SelectItem>
                  <SelectItem value="정책">정책</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notice-content">내용</Label>
              <Textarea
                id="notice-content"
                placeholder="공지사항 내용을 입력하세요"
                rows={5}
                value={noticeForm.content}
                onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
              />
            </div>
            <Button 
              onClick={handleCreateNotice}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              공지사항 등록
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 공지사항 목록 */}
      <Card className="backdrop-blur-sm bg-white/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>공지사항 목록</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((notice) => (
                    <TableRow key={notice.id}>
                      <TableCell className="font-medium">{notice.title}</TableCell>
                      <TableCell>{getCategoryBadge(notice.category)}</TableCell>
                      <TableCell>{new Date(notice.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={handlePrintNotice}>
                            <Printer className="h-4 w-4" />
                          </Button>
                          {/* 수정 버튼 (추후 구현 시 연결) */}
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteNotice(notice.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      등록된 공지사항이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminNotices;