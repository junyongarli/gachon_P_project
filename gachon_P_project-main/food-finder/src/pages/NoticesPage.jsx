import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, User, ChevronRight, Clock, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 백엔드에서 공지사항 가져오기
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('/api/community/notices');
        if (response.ok) {
          const data = await response.json();
          setNotices(data);
          // (선택) 처음에 가장 최신 공지사항 하나를 자동으로 선택해두려면 아래 주석 해제
          // if (data.length > 0) setSelectedNotice(data[0]);
        }
      } catch (error) {
        console.error("공지사항 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const getCategoryBadge = (category) => {
    const config = {
      event: { label: '이벤트', className: 'bg-purple-100 text-purple-700 border-purple-200' },
      maintenance: { label: '점검', className: 'bg-blue-100 text-blue-700 border-blue-200' },
      policy: { label: '정책', className: 'bg-gray-100 text-gray-700 border-gray-200' },
      update: { label: '업데이트', className: 'bg-green-100 text-green-700 border-green-200' },
      general: { label: '일반', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    };
    // DB에 저장된 값이 소문자가 아닐 수도 있으므로 lowercase 처리
    const key = category?.toLowerCase() || 'general';
    const { label, className } = config[key] || config.general;
    
    return <Badge className={`${className} border`}>{label}</Badge>;
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  };

  // 7일 이내 게시물인지 확인 (NEW 배지용)
  const isNewPost = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days < 7;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
      
      {/* 배경 장식 요소 */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-lg">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent text-left font-bold">
                공지사항
              </h1>
              <p className="text-gray-600 mt-1 text-left">중요한 소식과 업데이트를 확인하세요</p>
            </div>
          </div>
        </motion.div>

        {/* 공지사항 목록 & 상세 보기 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          
          {/* [왼쪽] 공지사항 목록 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 overflow-y-auto pr-2"
          >
            {notices.length === 0 ? (
                <div className="text-center py-10 text-gray-500">등록된 공지사항이 없습니다.</div>
            ) : (
                notices.map((notice, index) => {
                  const isNew = isNewPost(notice.createdAt);
                  return (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`bg-white/80 backdrop-blur-sm shadow-md border hover:shadow-lg transition-all cursor-pointer ${
                          selectedNotice?.id === notice.id ? 'border-orange-500 border-2 bg-orange-50/50' : 'border-white/20'
                        } ${isNew ? 'ring-1 ring-orange-100' : ''}`}
                        onClick={() => setSelectedNotice(notice)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getCategoryBadge(notice.category)}
                              {isNew && (
                                <Badge className="bg-red-500 text-white border-none hover:bg-red-600">NEW</Badge>
                              )}
                              {notice.isImportant && (
                                <Badge className="bg-yellow-500 text-white border-none hover:bg-yellow-600">필독</Badge>
                              )}
                            </div>
                            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${selectedNotice?.id === notice.id ? 'rotate-90 text-orange-500' : ''}`} />
                          </div>
                          
                          <h3 className={`text-lg mb-2 text-left font-semibold ${selectedNotice?.id === notice.id ? 'text-orange-700' : 'text-gray-800'}`}>
                            {notice.title}
                          </h3>
                          
                          {/* 목록에서는 내용 미리보기 (2줄 제한) */}
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2 text-left">
                            {notice.content}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(notice.createdAt)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
            )}
          </motion.div>

          {/* [오른쪽] 상세 보기 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block h-full" 
            // 모바일(lg 미만)에서는 목록만 보이고, 클릭 시 별도 처리 필요하지만 
            // 현재 요청주신 '좌측 목록, 우측 상세' 구조는 데스크탑 기준이므로 이렇게 처리합니다.
          >
            {selectedNotice ? (
              <Card className="bg-white/90 backdrop-blur-md shadow-xl border border-white/20 h-full overflow-hidden flex flex-col">
                <CardContent className="p-8 flex flex-col h-full overflow-y-auto">
                    <div className="flex items-center gap-2 mb-4">
                      {getCategoryBadge(selectedNotice.category)}
                      {isNewPost(selectedNotice.createdAt) && (
                        <Badge className="bg-red-500 text-white border-none">NEW</Badge>
                      )}
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left leading-tight">
                      {selectedNotice.title}
                    </h2>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-6">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <User className="w-4 h-4" />
                        </div>
                        <span>관리자</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="p-2 bg-gray-100 rounded-full">
                            <Calendar className="w-4 h-4" />
                         </div>
                        {/* 상세 페이지에서는 날짜와 시간을 자세히 표시 */}
                        <span>{new Date(selectedNotice.createdAt).toLocaleString('ko-KR')}</span>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-left">
                      {selectedNotice.content}
                    </div>

                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/60 backdrop-blur-sm border border-white/20 h-full flex items-center justify-center border-dashed border-2">
                <CardContent className="p-12 text-center">
                  <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                      <Bell className="w-12 h-12 text-orange-400" />
                  </div>
                  <p className="text-xl font-medium text-gray-700 mb-2">공지사항을 선택해주세요</p>
                  <p className="text-gray-500">왼쪽 목록에서 제목을 클릭하면 상세 내용을 확인할 수 있습니다.</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
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

export default NoticesPage;