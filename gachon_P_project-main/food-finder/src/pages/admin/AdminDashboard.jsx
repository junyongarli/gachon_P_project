import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Bell, Brain, MessageSquare, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'motion/react';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1248,
    totalRestaurants: 342,
    totalReviews: 5621,
    activeNotifications: 12,
    aiQueries: 8934,
    communityPosts: 234,
  });

  const statCards = [
    {
      title: '총 사용자',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12.5%',
    },
    {
      title: '등록 시설',
      value: stats.totalRestaurants.toLocaleString(),
      icon: Activity,
      color: 'from-orange-500 to-red-600',
      change: '+8.2%',
    },
    {
      title: '전체 리뷰',
      value: stats.totalReviews.toLocaleString(),
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      change: '+15.3%',
    },
    {
      title: '활성 알림',
      value: stats.activeNotifications.toLocaleString(),
      icon: Bell,
      color: 'from-purple-500 to-purple-600',
      change: '-2.1%',
    },
    {
      title: 'AI 쿼리',
      value: stats.aiQueries.toLocaleString(),
      icon: Brain,
      color: 'from-pink-500 to-pink-600',
      change: '+24.7%',
    },
    {
      title: '커뮤니티 글',
      value: stats.communityPosts.toLocaleString(),
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-500',
      change: '+5.8%',
    },
  ];

  return (
    <div>
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          대시보드
        </h1>
        <p className="text-muted-foreground">
          전체 시스템 현황을 한눈에 확인하세요
        </p>
      </motion.div>

      {/* 통계 카드 그리드 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden backdrop-blur-sm bg-white/80 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-2`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="mb-1">{stat.value}</div>
                    <p
                      className={`text-muted-foreground ${
                        stat.change.startsWith('+')
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 최근 활동 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: '홍길동', action: '새로운 맛집 등록', time: '5분 전' },
                { user: '김철수', action: '리뷰 작성', time: '12분 전' },
                { user: '이영희', action: 'AI 퀴즈 완료', time: '23분 전' },
                { user: '박민수', action: '커뮤니티 글 작성', time: '1시간 전' },
                { user: '최지원', action: '맛집 찜하기', time: '2시간 전' },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                >
                  <div>
                    <p>
                      <span className="text-orange-600">{activity.user}</span>님이{' '}
                      {activity.action}
                    </p>
                  </div>
                  <p className="text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
