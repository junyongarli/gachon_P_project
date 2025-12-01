import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Bell,
  Plus,
  Trash2,
  Edit,
  Search,
  Eye,
  Printer,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

function AdminNotices() {
  const [searchQuery, setSearchQuery] = useState('');

  // 공지사항 상태
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: '맛맵 서비스 정기 점검 안내',
      category: '점검',
      content: '2024년 11월 30일 새벽 2시부터 4시까지 서비스 점검이 진행됩니다.',
      createdAt: '2024-11-28',
      views: 234,
      isNew: true,
    },
    {
      id: 2,
      title: '새로운 AI 추천 기능 업데이트',
      category: '이벤트',
      content: '더욱 정확한 맛집 추천을 위한 AI 알고리즘이 업데이트되었습니다.',
      createdAt: '2024-11-27',
      views: 456,
      isNew: true,
    },
    {
      id: 3,
      title: '개인정보 처리방침 변경 안내',
      category: '정책',
      content: '개인정보 처리방침이 일부 변경되었습니다.',
      createdAt: '2024-11-25',
      views: 189,
      isNew: false,
    },
  ]);

  const [noticeForm, setNoticeForm] = useState({
    title: '',
    category: '',
    content: '',
  });

  // 공지사항 관련 함수
  const handleCreateNotice = () => {
    if (!noticeForm.title || !noticeForm.category || !noticeForm.content) {
      toast.error('모든 필드를 입력해주세요');
      return;
    }

    const newNotice = {
      id: notices.length + 1,
      ...noticeForm,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      isNew: true,
    };

    setNotices([newNotice, ...notices]);
    setNoticeForm({ title: '', category: '', content: '' });
    toast.success('공지사항이 등록되었습니다');
  };

  const handleDeleteNotice = (id) => {
    if (confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      setNotices(notices.filter((notice) => notice.id !== id));
      toast.success('공지사항이 삭제되었습니다');
    }
  };

  const handlePrintNotice = (notice) => {
    window.print();
    toast.success('인쇄 준비 완료');
  };

  const getCategoryBadge = (category) => {
    const colors = {
      점검: 'bg-blue-500',
      이벤트: 'bg-purple-500',
      정책: 'bg-gray-500',
    };
    return <Badge className={colors[category] || 'bg-gray-500'}>{category}</Badge>;
  };

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const noticeStats = {
    total: notices.length,
    new: notices.filter((n) => n.isNew).length,
    totalViews: notices.reduce((sum, n) => sum + n.views, 0),
  };

  return (
    <div>
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
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
          { label: '신규 공지', value: noticeStats.new, icon: Plus, color: 'from-orange-500 to-orange-600' },
          { label: '총 조회수', value: noticeStats.totalViews, icon: Eye, color: 'from-purple-500 to-purple-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground">{stat.label}</CardTitle>
                <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-2`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div>{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 공지사항 작성 */}
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
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              공지사항 등록
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 검색 */}
      <Card className="backdrop-blur-sm bg-white/80 mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="공지사항 제목 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* 공지사항 목록 */}
      <Card className="backdrop-blur-sm bg-white/80">
        <CardHeader>
          <CardTitle>공지사항 목록 ({filteredNotices.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>조회수</TableHead>
                <TableHead>등록일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {notice.isNew && (
                        <Badge className="bg-red-500">NEW</Badge>
                      )}
                      <span>{notice.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(notice.category)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      {notice.views}
                    </div>
                  </TableCell>
                  <TableCell>{notice.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePrintNotice(notice)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminNotices;
