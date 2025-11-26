import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageCircle, MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';

function CustomerServicePage() {
  const { user } = useAuth();

  // 공지사항
  const [notices] = useState([
    {
      id: 1,
      title: '서비스 업데이트 안내 (v2.0)',
      content: '새로운 기능이 추가되었습니다. AI 추천 알고리즘이 개선되어 더욱 정확한 맛집 추천이 가능합니다.',
      date: '2024-01-20',
      isNew: true,
    },
    {
      id: 2,
      title: '설날 연휴 고객센터 운영 안내',
      content: '설날 연휴 기간(2024.02.09~02.11) 고객센터 운영이 일시 중단됩니다.',
      date: '2024-01-18',
      isNew: false,
    },
    {
      id: 3,
      title: '개인정보 처리방침 변경 안내',
      content: '개인정보 처리방침이 일부 변경되었습니다. 자세한 내용은 본문을 확인해주세요.',
      date: '2024-01-15',
      isNew: false,
    },
  ]);

  // 문의하기
  const [inquiry, setInquiry] = useState({
    title: '',
    content: '',
  });

  // 피드백
  const [feedback, setFeedback] = useState({
    category: 'general',
    content: '',
  });

  const handleInquirySubmit = () => {
    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    if (!inquiry.title.trim() || !inquiry.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // TODO: API 연동
    alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
    setInquiry({ title: '', content: '' });
  };

  const handleFeedbackSubmit = () => {
    if (!feedback.content.trim()) {
      alert('피드백 내용을 입력해주세요.');
      return;
    }

    // TODO: API 연동
    alert('소중한 피드백 감사합니다! 서비스 개선에 적극 반영하겠습니다.');
    setFeedback({ category: 'general', content: '' });
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
              <p className="text-gray-600 mt-1">공지사항 확인 및 문의사항을 남겨주세요</p>
            </div>
          </div>
        </motion.div>

        {/* 탭 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="notice" className="w-full">
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-6">
              <TabsTrigger value="notice">공지사항</TabsTrigger>
              <TabsTrigger value="inquiry">문의하기</TabsTrigger>
              <TabsTrigger value="feedback">피드백</TabsTrigger>
            </TabsList>

            {/* 공지사항 탭 */}
            <TabsContent value="notice">
              <div className="space-y-4">
                {notices.map((notice, index) => (
                  <motion.div
                    key={notice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-all cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl text-gray-800">
                                {notice.title}
                              </h3>
                              {notice.isNew && (
                                <Badge className="bg-red-500 text-white border-none">
                                  NEW
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3 leading-relaxed">
                              {notice.content}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{notice.date}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

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
                        <MessageSquare className="w-4 h-4 mr-2" />
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

            {/* 피드백 탭 */}
            <TabsContent value="feedback">
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700">
                        💡 여러분의 소중한 의견이 더 나은 서비스를 만듭니다!
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">피드백 종류</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'general', label: '일반 의견' },
                          { id: 'bug', label: '버그 제보' },
                          { id: 'feature', label: '기능 제안' },
                          { id: 'improvement', label: '개선 요청' },
                        ].map((category) => (
                          <Button
                            key={category.id}
                            onClick={() => setFeedback({ ...feedback, category: category.id })}
                            variant={feedback.category === category.id ? 'default' : 'outline'}
                            size="sm"
                            className={
                              feedback.category === category.id
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                : 'hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300'
                            }
                          >
                            {category.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">피드백 내용</label>
                      <Textarea
                        placeholder="서비스에 대한 의견을 자유롭게 작성해주세요"
                        value={feedback.content}
                        onChange={(e) => setFeedback({ ...feedback, content: e.target.value })}
                        rows={8}
                        className="resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleFeedbackSubmit}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      피드백 보내기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

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
