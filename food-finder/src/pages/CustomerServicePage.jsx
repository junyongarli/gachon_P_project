import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  MessageSquare, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Edit,
  Trash2,
  X,
  Tag
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// 카테고리 정의
const CATEGORIES = [
  { value: 'account', label: '계정/로그인 문제', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'usage', label: '앱 사용 문의', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'ai', label: 'AI 추천 관련', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { value: 'bug', label: '버그 신고', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'other', label: '기타 문의', color: 'bg-gray-100 text-gray-700 border-gray-200' },
];

function CustomerServicePage() {
  const { user } = useAuth();

  // 문의사항 목록 (실제로는 백엔드에서 가져옴)
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      title: '앱 사용 중 오류 발생',
      content: '스마트 검색 기능 사용 시 지도가 로딩되지 않습니다.',
      category: 'bug',
      status: 'pending',
      createdAt: '2024-01-15 10:30',
      reply: null,
    },
    {
      id: 2,
      title: '추천 결과 관련 문의',
      content: 'AI 추천 결과가 제 취향과 맞지 않는 것 같습니다.',
      category: 'ai',
      status: 'replied',
      createdAt: '2024-01-10 14:20',
      reply: '안녕하세요. 퀴즈 답변을 더 구체적으로 선택하시면 더 정확한 추천이 가능합니다.',
      repliedAt: '2024-01-11 09:00',
    },
  ]);

  // 문의하기
  const [inquiry, setInquiry] = useState({
    title: '',
    content: '',
    category: 'other'
  });

  // 수정 모드
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', content: '', category: 'other' });

  // 삭제 확인
  const [deleteId, setDeleteId] = useState(null);

  const handleInquirySubmit = () => {
    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    if (!inquiry.title.trim() || !inquiry.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const newInquiry = {
      id: inquiries.length + 1,
      ...inquiry,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reply: null,
    };

    setInquiries([newInquiry, ...inquiries]);
    setInquiry({ title: '', content: '', category: 'other' });
    alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
  };

  // 문의 수정
  const handleEdit = (inquiry) => {
    setEditingId(inquiry.id);
    setEditData({ title: inquiry.title, content: inquiry.content, category: inquiry.category });
  };

  const handleUpdate = (id) => {
    setInquiries(inquiries.map(inq => 
      inq.id === id 
        ? { ...inq, title: editData.title, content: editData.content, category: editData.category }
        : inq
    ));
    setEditingId(null);
  };

  // 문의 삭제
  const handleDelete = (id) => {
    setInquiries(inquiries.filter(inq => inq.id !== id));
    setDeleteId(null);
  };

  const getStatusBadge = (status) => {
    if (status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 border">대기중</Badge>;
    }
    return <Badge className="bg-green-100 text-green-700 border-green-200 border">답변완료</Badge>;
  };

  const getCategoryBadge = (category) => {
    const cat = CATEGORIES.find(c => c.value === category);
    if (!cat) return null;
    return (
      <Badge className={`${cat.color} border`}>
        <Tag className="w-3 h-3 mr-1" />
        {cat.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;
    return dateString.split(' ')[0];
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
      
      {/* 배경 장식 요소 */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-lg">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                고객센터
              </h1>
              <p className="text-gray-600 mt-1">문의사항을 남기고 답변을 확인하세요</p>
            </div>
          </div>
        </motion.div>

        {/* 탭 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="inquiry" className="w-full">
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 mb-6">
              <TabsTrigger value="inquiry">문의하기</TabsTrigger>
              <TabsTrigger value="history">문의내역 확인</TabsTrigger>
            </TabsList>

            {/* 문의하기 탭 */}
            <TabsContent value="inquiry">
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                <CardContent className="p-6">
                  {user ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-700">
                          💬 문의하신 내용은 영업일 기준 1-2일 내에 이메일로 답변드립니다.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">카테고리</label>
                        <Select
                          value={inquiry.category}
                          onValueChange={(value) => setInquiry({ ...inquiry, category: value })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="카테고리를 선택하세요">
                              {CATEGORIES.find(cat => cat.value === inquiry.category)?.label}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">문의 제목</label>
                        <Input
                          type="text"
                          placeholder="문의 제목을 입력하세요"
                          value={inquiry.title}
                          onChange={(e) => setInquiry({ ...inquiry, title: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">문의 내용</label>
                        <Textarea
                          placeholder="문의하실 내용을 자세히 입력해주세요"
                          value={inquiry.content}
                          onChange={(e) => setInquiry({ ...inquiry, content: e.target.value })}
                          rows={8}
                          className="resize-none"
                        />
                      </div>

                      <Button
                        onClick={handleInquirySubmit}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        문의하기
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-xl text-gray-600 mb-4">로그인이 필요한 서비스입니다</p>
                      <p className="text-gray-500 mb-6">문의하려면 로그인해주세요</p>
                      <a href="/login">
                        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                          로그인하러 가기
                        </Button>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 문의내역 확인 탭 */}
            <TabsContent value="history">
              {user ? (
                <div className="space-y-4">
                  {inquiries.length === 0 ? (
                    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                      <CardContent className="p-12 text-center">
                        <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-xl text-gray-600 mb-2">작성한 문의가 없습니다</p>
                        <p className="text-gray-500">궁금하신 사항이 있으시면 문의를 작성해주세요</p>
                      </CardContent>
                    </Card>
                  ) : (
                    inquiries.map((inq, index) => (
                      <motion.div
                        key={inq.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-all">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {getStatusBadge(inq.status)}
                                  {getCategoryBadge(inq.category)}
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatDate(inq.createdAt)}</span>
                                  </div>
                                </div>
                                
                                {editingId === inq.id ? (
                                  <div className="space-y-2">
                                    <Select
                                      value={editData.category}
                                      onValueChange={(value) => setEditData({ ...editData, category: value })}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue>
                                          {CATEGORIES.find(cat => cat.value === editData.category)?.label}
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent>
                                        {CATEGORIES.map(cat => (
                                          <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      value={editData.title}
                                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                    />
                                    <Textarea
                                      value={editData.content}
                                      onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                                      rows={4}
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleUpdate(inq.id)}
                                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                                      >
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        저장
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingId(null)}
                                      >
                                        <X className="w-3 h-3 mr-1" />
                                        취소
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <h3 className="text-lg text-gray-800 mb-2">
                                      {inq.title}
                                    </h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">
                                      {inq.content}
                                    </p>
                                  </>
                                )}
                              </div>
                              
                              {/* 수정/삭제 버튼 */}
                              {editingId !== inq.id && inq.status === 'pending' && (
                                <div className="flex gap-2 ml-4">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEdit(inq)}
                                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setDeleteId(inq.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          
                          {/* 답변 */}
                          {inq.reply && (
                            <CardContent className="pt-0">
                              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertCircle className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm text-orange-600">관리자 답변</span>
                                  <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                                    <Calendar className="w-3 h-3" />
                                    <span>{inq.repliedAt}</span>
                                  </div>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                  {inq.reply}
                                </p>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl text-gray-600 mb-4">로그인이 필요한 서비스입니다</p>
                    <p className="text-gray-500 mb-6">문의내역을 확인하려면 로그인해주세요</p>
                    <a href="/login">
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                        로그인하러 가기
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>문의를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 문의와 관련된 모든 데이터가 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default CustomerServicePage;