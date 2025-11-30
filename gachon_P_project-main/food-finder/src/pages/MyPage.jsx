import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MessageSquarePlus, 
  MessageSquare, 
  Clock, 
  Calendar, 
  Edit, 
  Trash2,
  Send,
  X,
  CheckCircle,
  AlertCircle,
  Tag
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

function MyPage() {
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

  // 새 문의 작성
  const [newInquiry, setNewInquiry] = useState({ title: '', content: '', category: 'other' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 수정 모드
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', content: '', category: 'other' });

  // 삭제 확인
  const [deleteId, setDeleteId] = useState(null);

  // 문의 작성
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newInquiry.title || !newInquiry.content) return;

    const inquiry = {
      id: inquiries.length + 1,
      ...newInquiry,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reply: null,
    };

    setInquiries([inquiry, ...inquiries]);
    setNewInquiry({ title: '', content: '', category: 'other' });
    setIsDialogOpen(false);
  };

  // 문의 수정
  const handleEdit = (inquiry) => {
    setEditingId(inquiry.id);
    setEditData({ title: inquiry.title, content: inquiry.content, category: inquiry.category });
  };

  const handleUpdate = (id) => {
    setInquiries(inquiries.map(inquiry => 
      inquiry.id === id 
        ? { ...inquiry, title: editData.title, content: editData.content, category: editData.category }
        : inquiry
    ));
    setEditingId(null);
  };

  // 문의 삭제
  const handleDelete = (id) => {
    setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
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
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  마이페이지
                </h1>
                <p className="text-gray-600 mt-1">{user?.username}님의 문의내역</p>
              </div>
            </div>
            
            {/* 문의 작성 버튼 */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  <MessageSquarePlus className="w-4 h-4 mr-2" />
                  문의 작성
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    새 문의사항 작성
                  </DialogTitle>
                  <DialogDescription>
                    궁금하신 사항이나 불편사항을 작성해주세요
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">제목</label>
                    <Input
                      placeholder="문의 제목을 입력하세요"
                      value={newInquiry.title}
                      onChange={(e) => setNewInquiry({ ...newInquiry, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">카테고리</label>
                    <Select
                      value={newInquiry.category}
                      onValueChange={(value) => setNewInquiry({ ...newInquiry, category: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="카테고리를 선택하세요">
                          {CATEGORIES.find(cat => cat.value === newInquiry.category)?.label}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <Tag className={`w-4 h-4 mr-2 ${cat.color}`} />
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">내용</label>
                    <Textarea
                      placeholder="문의 내용을 상세히 작성해주세요"
                      value={newInquiry.content}
                      onChange={(e) => setNewInquiry({ ...newInquiry, content: e.target.value })}
                      rows={8}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      등록하기
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* 문의 목록 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {inquiries.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-2">작성한 문의가 없습니다</p>
                <p className="text-gray-500">궁금하신 사항이 있으시면 문의를 작성해주세요</p>
              </CardContent>
            </Card>
          ) : (
            inquiries.map((inquiry, index) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(inquiry.status)}
                          {getCategoryBadge(inquiry.category)}
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(inquiry.createdAt)}</span>
                          </div>
                        </div>
                        
                        {editingId === inquiry.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editData.title}
                              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            />
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
                            <Textarea
                              value={editData.content}
                              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                              rows={4}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdate(inquiry.id)}
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
                              {inquiry.title}
                            </h3>
                            <p className="text-gray-600 whitespace-pre-wrap">
                              {inquiry.content}
                            </p>
                          </>
                        )}
                      </div>
                      
                      {/* 수정/삭제 버튼 */}
                      {editingId !== inquiry.id && inquiry.status === 'pending' && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(inquiry)}
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteId(inquiry.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  {/* 답변 */}
                  {inquiry.reply && (
                    <CardContent className="pt-0">
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-orange-600">관리자 답변</span>
                          <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                            <Calendar className="w-3 h-3" />
                            <span>{inquiry.repliedAt}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {inquiry.reply}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))
          )}
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

export default MyPage;