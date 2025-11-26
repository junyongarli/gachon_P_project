import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Utensils, TrendingUp, Download, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

function AdminStatistics() {
  const [timeRange, setTimeRange] = useState('week');

  const stats = {
    userGrowth: [
      { period: '1주차', users: 120 },
      { period: '2주차', users: 145 },
      { period: '3주차', users: 178 },
      { period: '4주차', users: 203 },
    ],
    popularCategories: [
      { name: '한식', count: 456, percentage: 35 },
      { name: '양식', count: 342, percentage: 26 },
      { name: '일식', count: 234, percentage: 18 },
      { name: '중식', count: 156, percentage: 12 },
      { name: '기타', count: 112, percentage: 9 },
    ],
    topRestaurants: [
      { name: '맛있는 한식당', visits: 234, rating: 4.8 },
      { name: '이탈리안 레스토랑', visits: 198, rating: 4.7 },
      { name: '일본식 라멘', visits: 167, rating: 4.6 },
      { name: '중국집 만리장성', visits: 145, rating: 4.5 },
      { name: '프렌치 다이닝', visits: 123, rating: 4.9 },
    ],
  };

  const summaryCards = [
    {
      title: '일일 활성 사용자',
      value: '2,345',
      change: '+12.5%',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: '주간 신규 가입',
      value: '456',
      change: '+8.3%',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      title: '총 방문 수',
      value: '8,934',
      change: '+15.2%',
      icon: Utensils,
      color: 'from-orange-500 to-red-600',
    },
    {
      title: '평균 체류시간',
      value: '12분 34초',
      change: '+3.1%',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div>
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            통계
          </h1>
          <p className="text-muted-foreground">
            서비스 이용 현황과 주요 지표를 확인하세요
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            기간 설정
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
            <Download className="mr-2 h-4 w-4" />
            리포트 다운로드
          </Button>
        </div>
      </motion.div>

      {/* 요약 카드 */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`rounded-lg bg-gradient-to-br ${card.color} p-2`}>
                  <card.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-1">{card.value}</div>
                <p className="text-green-600">{card.change} from last period</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 사용자 증가 추이 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="backdrop-blur-sm bg-white/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                사용자 증가 추이
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.userGrowth.map((data, index) => (
                  <div key={data.period}>
                    <div className="mb-2 flex items-center justify-between">
                      <span>{data.period}</span>
                      <span>{data.users}명</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.users / 250) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 인기 카테고리 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="backdrop-blur-sm bg-white/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                인기 음식 카테고리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.popularCategories.map((category, index) => (
                  <div key={category.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <span>{category.name}</span>
                      <span>
                        {category.count}건 ({category.percentage}%)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${category.percentage}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                        className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 인기 맛집 순위 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-orange-600" />
              TOP 5 인기 맛집
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topRestaurants.map((restaurant, index) => (
                <div
                  key={restaurant.name}
                  className="flex items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-300 to-gray-400'
                        : index === 2
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                        : 'bg-gray-200'
                    }`}>
                      <span className={index < 3 ? 'text-white' : 'text-gray-600'}>
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p>{restaurant.name}</p>
                      <p className="text-muted-foreground">
                        ⭐ {restaurant.rating}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>방문 {restaurant.visits}회</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminStatistics;
