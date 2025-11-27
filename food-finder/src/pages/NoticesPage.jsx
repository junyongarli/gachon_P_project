import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, User, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'motion/react';

function NoticesPage() {
  // 관리자가 발송한 공지사항 (실제로는 백엔드에서 가져옴)
  const [notices] = useState([
    {
      id: 1,
      title: '신규 이벤트 안내',
      message: '1월 이벤트가 시작되었습니다. 많은 참여 부탁드립니다!',
      sentDate: '2024-01-15 10:30',
      isNew: true,
      category: 'event',
    },
    {
      id: 2,
      title: '시스템 점검 공지',
      message: '1월 20일 새벽 2시~4시 시스템 점검이 있습니다. 이용에 참고 부탁드립니다.',
      sentDate: '2024-01-14 14:20',
      isNew: true,
      category: 'maintenance',
    },
    {
      id: 3,
      title: '서비스 이용약관 변경 안내',
      message: '서비스 이용약관이 일부 변경되었습니다. 자세한 내용은 설정 페이지에서 확인하실 수 있습니다.',
      sentDate: '2024-01-10 09:00',
      isNew: false,
      category: 'policy',
    },
    {
      id: 4,
      title: '신규 기능 업데이트',
      message: '스마트 검색 기능이 추가되었습니다. 거리 및 경로 기반으로 맛집을 찾아보세요!',
      sentDate: '2024-01-05 16:45',
      isNew: false,
      category: 'update',
    },
    {
      id: 5,
      title: '새해 인사',
      message: '2024년 새해가 밝았습니다. 올 한 해도 맛집 추천 AI와 함께 맛있는 하루 되세요!',
      sentDate: '2024-01-01 00:00',
      isNew: false,
      category: 'general',
    },
  ]);

  const [selectedNotice, setSelectedNotice] = useState(null);

  const getCategoryBadge = (category) => {
    const config = {
      event: { label: '이벤트', className: 'bg-purple-100 text-purple-700 border-purple-200' },
      maintenance: { label: '점검', className: 'bg-blue-100 text-blue-700 border-blue-200' },
      policy: { label: '정책', className: 'bg-gray-100 text-gray-700 border-gray-200' },
      update: { label: '업데이트', className: 'bg-green-100 text-green-700 border-green-200' },
      general: { label: '일반', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    };
    const { label, className } = config[category] || config.general;
    return <Badge className={`${className} border`}>{label}</Badge>;
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
              <h1 className="text-4xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                공지사항
              </h1>
              <p className="text-gray-600 mt-1">중요한 소식과 업데이트를 확인하세요</p>
            </div>
          </div>
        </motion.div>

        {/* 공지사항 목록 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 목록 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {notices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`bg-white/80 backdrop-blur-sm shadow-lg border hover:shadow-xl transition-all cursor-pointer ${
                    selectedNotice?.id === notice.id ? 'border-orange-500 border-2' : 'border-white/20'
                  } ${notice.isNew ? 'ring-2 ring-orange-200' : ''}`}
                  onClick={() => setSelectedNotice(notice)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryBadge(notice.category)}
                        {notice.isNew && (
                          <Badge className="bg-red-500 text-white border-none">NEW</Badge>
                        )}
                      </div>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${selectedNotice?.id === notice.id ? 'rotate-90' : ''}`} />
                    </div>
                    
                    <h3 className="text-lg text-gray-800 mb-2">
                      {notice.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {notice.message}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(notice.sentDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{notice.sentDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* 상세 보기 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:sticky lg:top-8"
          >
            {selectedNotice ? (
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        {getCategoryBadge(selectedNotice.category)}
                        {selectedNotice.isNew && (
                          <Badge className="bg-red-500 text-white border-none">NEW</Badge>
                        )}
                      </div>
                      
                      <h2 className="text-2xl text-gray-800 mb-4">
                        {selectedNotice.title}
                      </h2>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>관리자</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{selectedNotice.sentDate}</span>
                        </div>
                      </div>
                      
                      <div className="h-px bg-gradient-to-r from-orange-200 via-red-200 to-yellow-200 mb-6"></div>
                      
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedNotice.message}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setSelectedNotice(null)}
                    variant="outline"
                    className="w-full mt-6"
                  >
                    목록으로 돌아가기
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 h-full flex items-center justify-center">
                <CardContent className="p-12 text-center">
                  <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-xl text-gray-600 mb-2">공지사항을 선택해주세요</p>
                  <p className="text-gray-500">왼쪽 목록에서 공지사항을 클릭하면 자세한 내용을 확인할 수 있습니다</p>
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