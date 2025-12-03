import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, MessageSquare, Calendar, Clock, CheckCircle, 
  AlertCircle, Send, Edit, Trash2, X, Tag, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion'; // motion/react -> framer-motion으로 변경 권장
import { useAuth } from '@/contexts/AuthContext';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

// 카테고리 정의 (백엔드와 일치)
const CATEGORIES = [
  { value: 'account', label: '계정/로그인', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'usage', label: '이용 문의', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'bug', label: '버그 신고', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'other', label: '기타', color: 'bg-gray-100 text-gray-700 border-gray-200' },
];

function CustomerServicePage() {
  const { user, token } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 문의하기 폼 상태
  const [inquiry, setInquiry] = useState({ title: '', content: '', category: 'other' });

  // 수정 모드 상태
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', content: '', category: 'other' });

  // 삭제 모달 상태
  const [deleteId, setDeleteId] = useState(null);

  // 1. 내 문의 내역 불러오기 (API 연동)
  const fetchMyInquiries = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/community/inquiries/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setInquiries(data.inquiries);
      }
    } catch (error) {
      console.error("문의 내역 로딩 실패:", error);
      toast.error("문의 내역을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 탭 변경 시 데이터 갱신
  const handleTabChange = (value) => {
    if (value === 'history') {
        fetchMyInquiries();
    }
  };

  // 2. 문의 등록 (API 연동)
  const handleInquirySubmit = async () => {
    if (!user) return toast.error('로그인이 필요합니다');
    if (!inquiry.title.trim() || !inquiry.content.trim()) return toast.error('제목과 내용을 입력해주세요');

    try {
      const response = await fetch('/api/community/inquiries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(inquiry)
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('문의가 접수되었습니다');
        setInquiry({ title: '', content: '', category: 'other' });
        // 내역 탭으로 이동하거나 새로고침 효과를 줄 수 있음
        fetchMyInquiries(); 
      } else {
        toast.error(data.message || '등록 실패');
      }
    } catch (error) {
      console.error(error);
      toast.error('서버 오류');
    }
  };

  // 3. 문의 수정 (API 연동)
  const handleUpdate = async (id) => {
    try {
        const response = await fetch(`/api/community/inquiries/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(editData)
        });
        
        const data = await response.json();
        if (data.success) {
            toast.success('수정되었습니다');
            setEditingId(null);
            fetchMyInquiries();
        } else {
            toast.error(data.message || '수정 실패');
        }
    } catch (error) {
        toast.error('오류 발생');
    }
  };

  // 4. 문의 삭제 (API 연동)
  const handleDelete = async (id) => {
    try {
        const response = await fetch(`/api/community/inquiries/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            toast.success('삭제되었습니다');
            setInquiries(inquiries.filter(inq => inq.id !== id));
        } else {
            toast.error('삭제 실패');
        }
    } catch (error) {
        toast.error('오류 발생');
    } finally {
        setDeleteId(null);
    }
  };

  // 수정 버튼 클릭 시 폼 채우기
  const handleEditClick = (inq) => {
    if (inq.status === 'completed') {
        return toast.error('답변이 완료된 문의는 수정할 수 없습니다.');
    }
    setEditingId(inq.id);
    setEditData({ title: inq.title, content: inq.content, category: inq.category });
  };

  const getStatusBadge = (status) => {
    return status === 'pending' 
        ? <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 border">대기중</Badge>
        : <Badge className="bg-green-100 text-green-700 border-green-200 border">답변완료</Badge>;
  };

  const getCategoryBadge = (category) => {
    const cat = CATEGORIES.find(c => c.value === category) || { label: category, color: 'bg-gray-100 text-gray-700' };
    return <Badge className={`${cat.color} border`}><Tag className="w-3 h-3 mr-1" />{cat.label}</Badge>;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 그라데이션 및 애니메이션 (유지) */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-lg">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold">
                고객센터
              </h1>
              <p className="text-gray-600 mt-1">문의사항을 남기고 답변을 확인하세요</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="inquiry" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 mb-6">
              <TabsTrigger value="inquiry">문의하기</TabsTrigger>
              <TabsTrigger value="history">내 문의 내역</TabsTrigger>
            </TabsList>

            {/* 문의하기 탭 */}
            <TabsContent value="inquiry">
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                <CardContent className="p-6">
                  {user ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-4 text-sm text-gray-700 border border-orange-100">
                          💬 문의하신 내용은 관리자가 확인 후 신속하게 답변해 드립니다.
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">카테고리</label>
                        <Select value={inquiry.category} onValueChange={(v) => setInquiry({ ...inquiry, category: v })}>
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map(cat => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">제목</label>
                        <Input placeholder="제목을 입력하세요" value={inquiry.title} onChange={(e) => setInquiry({ ...inquiry, title: e.target.value })} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">내용</label>
                        <Textarea placeholder="내용을 입력하세요" value={inquiry.content} onChange={(e) => setInquiry({ ...inquiry, content: e.target.value })} rows={6} className="resize-none" />
                      </div>

                      <Button onClick={handleInquirySubmit} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg">
                        <Send className="w-4 h-4 mr-2" /> 문의하기
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-xl text-gray-600 mb-4">로그인이 필요한 서비스입니다</p>
                      <a href="/login"><Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">로그인하러 가기</Button></a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 내 문의 내역 탭 */}
            <TabsContent value="history">
              {isLoading ? (
                 <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500"/></div>
              ) : inquiries.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                  <CardContent className="p-12 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    작성한 문의가 없습니다.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                    {inquiries.map((inq, index) => (
                      <motion.div 
                        key={inq.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all border-white/40">
                          <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                      {getStatusBadge(inq.status)}
                                      {getCategoryBadge(inq.category)}
                                      <span className="text-xs text-gray-400 flex items-center gap-1 ml-2">
                                          <Clock className="w-3 h-3"/> {new Date(inq.createdAt).toLocaleDateString()}
                                      </span>
                                  </div>
                                  
                                  {editingId !== inq.id && (
                                      <div className="flex gap-1">
                                          <Button size="icon" variant="ghost" onClick={() => handleEditClick(inq)} className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Edit className="w-4 h-4"/></Button>
                                          <Button size="icon" variant="ghost" onClick={() => setDeleteId(inq.id)} className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4"/></Button>
                                      </div>
                                  )}
                              </div>
                          </CardHeader>
                          <CardContent>
                              {editingId === inq.id ? (
                                  <div className="space-y-3 bg-orange-50 p-4 rounded-lg border border-orange-100">
                                      <Input value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} className="bg-white" />
                                      <Textarea value={editData.content} onChange={(e) => setEditData({...editData, content: e.target.value})} rows={3} className="bg-white" />
                                      <div className="flex justify-end gap-2">
                                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>취소</Button>
                                          <Button size="sm" onClick={() => handleUpdate(inq.id)} className="bg-orange-500 hover:bg-orange-600 text-white">저장</Button>
                                      </div>
                                  </div>
                              ) : (
                                  <>
                                      <h3 className="font-bold text-lg mb-2 text-gray-800">{inq.title}</h3>
                                      <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">{inq.content}</p>
                                  </>
                              )}

                              {inq.answer && (
                                  <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm">
                                      <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold text-sm">
                                          <CheckCircle className="w-4 h-4"/> 관리자 답변
                                      </div>
                                      <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{inq.answer}</p>
                                  </div>
                              )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
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
              className="bg-red-600 hover:bg-red-700 text-white"
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