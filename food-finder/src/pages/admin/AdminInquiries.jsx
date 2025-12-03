import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { MessageSquare, Search, Eye, Clock, CheckCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext'; // 토큰 사용

function AdminInquiries() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // [수정] API 데이터 연동을 위한 상태
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [answerText, setAnswerText] = useState('');

  // 1. 문의 목록 불러오기 (Read)
  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/community/admin/inquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setInquiries(data.inquiries);
      }
    } catch (error) {
      console.error("문의 조회 실패:", error);
      toast.error("문의 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // 2. 상태 변경 핸들러
  const handleInquiryStatusChange = async (id, newStatus) => {
    try {
        const response = await fetch(`/api/community/admin/inquiries/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            // UI 즉시 반영
            setInquiries(inquiries.map(inq => 
                inq.id === id ? { ...inq, status: newStatus } : inq
            ));
            toast.success(`상태가 변경되었습니다`);
        }
    } catch (error) {
        toast.error("상태 변경 실패");
    }
  };

  // 3. 답변 등록 핸들러
  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) {
      toast.error('답변 내용을 입력해주세요');
      return;
    }

    try {
        const response = await fetch(`/api/community/admin/inquiries/${selectedInquiry.id}/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ answer: answerText })
        });

        const data = await response.json();

        if (data.success) {
            toast.success('답변이 등록되었습니다');
            setAnswerText('');
            setSelectedInquiry(null); // 모달 닫기 (Dialog open 상태 제어 필요 시 추가 구현)
            fetchInquiries(); // 목록 새로고침
        } else {
            toast.error(data.message || '등록 실패');
        }
    } catch (error) {
        console.error(error);
        toast.error('서버 오류 발생');
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'AI 추천 관련': 'bg-orange-500',
      '배달 상태': 'bg-green-500',
      '기타 문의': 'bg-gray-500',
    };
    return <Badge className={`${colors[category] || 'bg-gray-500'} text-white`}>{category}</Badge>;
  };

  // 검색 필터링
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent text-2xl font-bold">
          문의사항 관리
        </h1>
        <p className="text-muted-foreground">사용자 문의를 확인하고 답변을 등록합니다</p>
      </motion.div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {[
          { label: '전체 문의', value: inquiryStats.total, icon: MessageSquare, color: 'from-blue-500 to-blue-600' },
          { label: '대기중', value: inquiryStats.pending, icon: Clock, color: 'from-orange-500 to-orange-600' },
          { label: '답변완료', value: inquiryStats.completed, icon: CheckCircle, color: 'from-green-500 to-green-600' },
        ].map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">{stat.label}</CardTitle>
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
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">로딩 중...</div>
          ) : (
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
                        <p className="text-muted-foreground text-xs">{inquiry.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
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
                                {selectedInquiry?.username} ({selectedInquiry?.email}) • {selectedInquiry && new Date(selectedInquiry.createdAt).toLocaleString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>문의 내용</Label>
                                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 mt-2 whitespace-pre-wrap">
                                  {selectedInquiry?.content}
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="answer-text">답변</Label>
                                {selectedInquiry?.status === 'completed' && selectedInquiry.answer ? (
                                  <div className="p-4 rounded-lg border border-green-200 bg-green-50 mt-2">
                                    <p className="text-green-800 whitespace-pre-wrap">{selectedInquiry.answer}</p>
                                    <p className="text-muted-foreground mt-2 text-xs">
                                      최종 수정: {new Date(selectedInquiry.answeredAt).toLocaleString()}
                                    </p>
                                    {/* 수정하려면 아래 텍스트에리어를 다시 보여주는 로직 추가 가능 */}
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
                              {(selectedInquiry?.status === 'pending' || !selectedInquiry?.answer) && (
                                <Button onClick={handleSubmitAnswer} className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                  <Send className="h-4 w-4 mr-2" /> 답변 등록
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        {/* 상태 수동 변경 버튼 */}
                        {inquiry.status === 'pending' ? (
                          <Button variant="ghost" size="icon" onClick={() => handleInquiryStatusChange(inquiry.id, 'completed')}>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => handleInquiryStatusChange(inquiry.id, 'pending')}>
                            <Clock className="h-4 w-4 text-orange-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminInquiries;