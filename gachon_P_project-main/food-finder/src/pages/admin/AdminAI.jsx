import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Database, Settings, BarChart, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

function AdminAI() {
  const [aiStats, setAiStats] = useState({
    totalQueries: 8934,
    todayQueries: 234,
    averageAccuracy: 94.5,
    modelVersion: 'v2.3.1',
  });

  const [prompts, setPrompts] = useState([
    {
      id: 1,
      category: '한식',
      prompt: '한국 전통 음식을 추천해주세요. 사용자의 매운맛 선호도를 고려하여...',
      accuracy: 96.2,
      usageCount: 1234,
    },
    {
      id: 2,
      category: '양식',
      prompt: '서양 음식을 추천해주세요. 특히 이탈리안 요리에 집중하여...',
      accuracy: 93.8,
      usageCount: 892,
    },
    {
      id: 3,
      category: '일식',
      prompt: '일본 음식을 추천해주세요. 신선도와 재료의 품질을 강조하여...',
      accuracy: 95.1,
      usageCount: 756,
    },
  ]);

  const statCards = [
    {
      title: '총 AI 쿼리',
      value: aiStats.totalQueries.toLocaleString(),
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: '오늘 쿼리',
      value: aiStats.todayQueries.toLocaleString(),
      icon: Sparkles,
      color: 'from-orange-500 to-red-600',
    },
    {
      title: '평균 정확도',
      value: `${aiStats.averageAccuracy}%`,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      title: '모델 버전',
      value: aiStats.modelVersion,
      icon: Database,
      color: 'from-blue-500 to-blue-600',
    },
  ];

  return (
    <div>
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          AI상호 관리
        </h1>
        <p className="text-muted-foreground">
          AI 추천 시스템의 프롬프트와 성능을 관리합니다
        </p>
      </motion.div>

      {/* 통계 카드 */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-2`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div>{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 프롬프트 관리 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-600" />
              AI 프롬프트 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {prompts.map((prompt, index) => (
              <div
                key={prompt.id}
                className="rounded-lg border-2 border-gray-200 bg-white p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                      {prompt.category}
                    </Badge>
                    <span className="text-muted-foreground">
                      정확도: {prompt.accuracy}%
                    </span>
                    <span className="text-muted-foreground">
                      사용횟수: {prompt.usageCount.toLocaleString()}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    수정
                  </Button>
                </div>
                <Textarea
                  value={prompt.prompt}
                  rows={2}
                  className="resize-none"
                  readOnly
                />
              </div>
            ))}
            <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <Sparkles className="mr-2 h-4 w-4" />
              새 프롬프트 추가
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI 성능 분석 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-orange-600" />
              성능 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span>사용자 만족도</span>
                  <span>92%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 w-[92%] rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span>추천 정확도</span>
                  <span>94.5%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 w-[94.5%] rounded-full bg-gradient-to-r from-green-500 to-green-600"></div>
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span>응답 속도</span>
                  <span>0.8초</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 w-[88%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminAI;
