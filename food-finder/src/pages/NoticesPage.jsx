import { useState, useEffect } from 'react';
// 상대 경로 사용 (.jsx 명시)
import { Card, CardContent } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Bell, Calendar, User, ChevronRight, Clock, Loader2, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 공지사항 데이터 불러오기
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('/api/community/notices');
        const data = await response.json();
        
        if (data.success) {
          setNotices(data.notices);
          // 데이터가 있으면 첫 번째 공지사항을 기본 선택 (선택 사항)
          // if (data.notices.length > 0) setSelectedNotice(data.notices[0]);
        }
      } catch (error) {
        console.error("공지사항 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // 카테고리별 뱃지 스타일
  const getCategoryBadge = (category) => {
    const styles = {
      '점검': 'bg-red-100 text-red-700 border-red-200',
      '이벤트': 'bg-purple-100 text-purple-700 border-purple-200',
      '정책': 'bg-blue-100 text-blue-700 border-blue-200',
      '일반': 'bg-gray-100 text-gray-700 border-gray-200',
      '업데이트': 'bg-green-100 text-green-700 border-green-200'
    };
    const className = styles[category] || styles['일반'];
    return <Badge className={`${className} border px-2 py-0.5`}>{category || '공지'}</Badge>;
  };

  // 날짜 포맷 (YYYY-MM-DD)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
        <div className="relative z-10 flex flex-col items-center">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
            <p className="text-orange-600 font-medium">공지사항을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50/50">
      {/* 배경 디자인 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-lg shadow-md">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">공지사항</h1>
              <p className="text-gray-600 mt-1 text-sm">서비스의 새로운 소식과 업데이트를 확인하세요</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
          
          {/* [왼쪽] 공지사항 목록 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.1 }}
            className="space-y-3 overflow-y-auto pr-2 custom-scrollbar"
          >
            {notices.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                    <CardContent className="p-10 text-center text-gray-500">
                        등록된 공지사항이 없습니다.
                    </CardContent>
                </Card>
            ) : (
                notices.map((notice, index) => {
                  const isSelected = selectedNotice?.id === notice.id;
                  return (
                    <motion.div 
                      key={notice.id} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                          isSelected 
                            ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-300 shadow-sm' 
                            : 'bg-white/80 border-white/40 hover:bg-white'
                        }`}
                        onClick={() => setSelectedNotice(notice)}
                      >
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              {getCategoryBadge(notice.category)}
                              {notice.isImportant && (
                                <Badge className="bg-red-500 text-white border-none px-1.5 py-0.5 text-[10px]">중요</Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(notice.createdAt)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <h3 className={`font-semibold text-base line-clamp-1 ${isSelected ? 'text-orange-700' : 'text-gray-800'}`}>
                              {notice.title}
                            </h3>
                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'rotate-90 text-orange-500' : ''}`} />
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                            {notice.content}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
            )}
          </motion.div>

          {/* [오른쪽] 상세 내용 보기 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
            className="hidden lg:flex flex-col h-full"
          >
            {selectedNotice ? (
              <Card className="bg-white/90 backdrop-blur-md shadow-lg border border-white/40 h-full flex flex-col overflow-hidden">
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-3 mb-6">
                      {getCategoryBadge(selectedNotice.category)}
                      <span className="text-sm text-gray-400 flex items-center gap-1 ml-auto">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedNotice.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-snug border-b pb-6 border-gray-100">
                      {selectedNotice.title}
                    </h2>
                    
                    <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedNotice.content}
                    </div>
                </div>
                <div className="bg-gray-50 p-4 border-t border-gray-100 text-right">
                   <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3" />
                      </div>
                      <span>관리자 작성</span>
                   </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-white/40 backdrop-blur-sm border-2 border-dashed border-orange-200 h-full flex items-center justify-center">
                <div className="text-center p-10">
                  <div className="bg-orange-100 p-4 rounded-full inline-block mb-4">
                    <Bell className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">공지사항을 선택해주세요</h3>
                  <p className="text-gray-500 mt-1 text-sm">좌측 목록에서 제목을 클릭하면 상세 내용을 볼 수 있습니다.</p>
                </div>
              </Card>
            )}
          </motion.div>

          {/* 모바일용 상세 보기 모달 (필요 시 구현) - 현재는 데스크탑 레이아웃 중심 */}
        </div>
      </div>

      {/* 스크롤바 스타일 */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.5);
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}

export default NoticesPage;