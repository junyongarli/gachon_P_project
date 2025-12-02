import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  MessageSquare,
  Search,
  Eye,
  Clock,
  CheckCircle,
  Send,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

function AdminInquiries() {
  const [searchQuery, setSearchQuery] = useState('');

  // 문의사항 상태
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      username: '김철수',
      email: 'kim@example.com',
      category: 'AI 추천 관련',
      title: 'AI 추천이 작동하지 않아요',
      content: '퀴즈를 완료했는데 추천 결과가 나오지 않습니다.',
      status: 'pending',
      createdAt: '2024-11-28 14:30',
      answer: null,
      answeredAt: null,
    },
    {
      id: 2,
      username: '이영희',
      email: 'lee@example.com',
      category: '배달 상태',
      title: '찜 목록이 저장되지 않습니다',
      content: '하트 버튼을 눌러도 찜 목록에 추가되지 않아요.',
      status: 'pending',
      createdAt: '2024-11-28 13:15',
      answer: null,
      answeredAt: null,
    },
    {
      id: 3,
      username: '박민수',
      email: 'park@example.com',
      category: '기타 문의',
      title: '회원 탈퇴 문의',
      content: '회원 탈퇴는 어떻게 하나요?',
      status: 'completed',
      createdAt: '2024-11-27 10:45',
      answer: '설정 > 계정 관리 > 회원 탈퇴 메뉴에서 진행하실 수 있습니다.',
      answeredAt: '2024-11-27 11:30',
    },
  ]);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [answerText, setAnswerText] = useState('');

  // 문의사항 관련 함수
  const handleInquiryStatusChange = (id, newStatus) => {
    setInquiries(
      inquiries.map((inquiry) =>
        inquiry.id === id ? { ...inquiry, status: newStatus } : inquiry
      )
    );
    toast.success(`문의 상태가 "${newStatus === 'pending' ? '대기중' : '답변완료'}"로 변경되었습니다`);
  };

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) {
      toast.error('답변 내용을 입력해주세요');
      return;
    }

    setInquiries(
      inquiries.map((inquiry) =>
        inquiry.id === selectedInquiry.id
          ? {
              ...inquiry,
              answer: answerText,
              answeredAt: new Date().toLocaleString('ko-KR'),
              status: 'completed',
            }
          : inquiry
      )
    );

    setSelectedInquiry(null);
    setAnswerText('');
    toast.success('답변이 등록되었습니다');
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'AI 추천 관련': 'bg-orange-500',
      '배달 상태': 'bg-green-500',
      '기타 문의': 'bg-gray-500',
    };
    return <Badge className={colors[category] || 'bg-gray-500'}>{category}</Badge>;
  };

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inquiryStats = {
    total: inquiries.length,
    pending: inquiries.filter((i) => i.status === 'pending').length,
    completed: inquiries.filter((i) => i.status === 'completed').length,
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
          문의사항 관리
        </h1>
        <p className="text-muted-foreground">
          사용자 문의를 확인하고 답변을 등록합니다
        </p>
      </motion.div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {[
          { label: '전체 문의', value: inquiryStats.total, icon: MessageSquare, color: 'from-blue-500 to-blue-600' },
          { label: '대기중', value: inquiryStats.pending, icon: Clock, color: 'from-orange-500 to-orange-600' },
          { label: '답변완료', value: inquiryStats.completed, icon: CheckCircle, color: 'from-green-500 to-green-600' },
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

      {/* 검색 */}
      <Card className="backdrop-blur-sm bg-white/80 mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="문의 제목 또는 작성자 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* 문의사항 목록 */}
      <Card className="backdrop-blur-sm bg-white/80">
        <CardHeader>
          <CardTitle>문의사항 목록 ({filteredInquiries.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>상태</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>작성자</TableHead>
                <TableHead>작성일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <Badge variant={inquiry.status === 'pending' ? 'default' : 'secondary'}>
                      {inquiry.status === 'pending' ? '대기중' : '답변완료'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getCategoryBadge(inquiry.category)}</TableCell>
                  <TableCell>{inquiry.title}</TableCell>
                  <TableCell>
                    <div>
                      <p>{inquiry.username}</p>
                      <p className="text-muted-foreground">{inquiry.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{inquiry.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setAnswerText(inquiry.answer || '');
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{selectedInquiry?.title}</DialogTitle>
                            <DialogDescription>
                              {selectedInquiry?.username} ({selectedInquiry?.email}) • {selectedInquiry?.createdAt}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* 문의 내용 */}
                            <div>
                              <Label>문의 내용</Label>
                              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 mt-2">
                                {selectedInquiry?.content}
                              </div>
                            </div>

                            {/* 답변 영역 */}
                            <div>
                              <Label htmlFor="answer-text">답변</Label>
                              {selectedInquiry?.status === 'completed' && selectedInquiry.answer ? (
                                <div className="p-4 rounded-lg border border-green-200 bg-green-50 mt-2">
                                  <p className="text-green-800">{selectedInquiry.answer}</p>
                                  <p className="text-muted-foreground mt-2">
                                    답변일: {selectedInquiry.answeredAt}
                                  </p>
                                </div>
                              ) : (
                                <Textarea
                                  id="answer-text"
                                  placeholder="답변을 작성해주세요"
                                  rows={5}
                                  value={answerText}
                                  onChange={(e) => setAnswerText(e.target.value)}
                                  className="mt-2"
                                />
                              )}
                            </div>
                          </div>
                          <DialogFooter>
                            {selectedInquiry?.status === 'pending' && (
                              <Button
                                onClick={handleSubmitAnswer}
                                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                              >
                                <Send className="h-4 w-4 mr-2" />
                                답변 등록
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      {inquiry.status === 'pending' ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleInquiryStatusChange(inquiry.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleInquiryStatusChange(inquiry.id, 'pending')}
                        >
                          <Clock className="h-4 w-4 text-orange-500" />
                        </Button>
                      )}
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

export default AdminInquiries;
