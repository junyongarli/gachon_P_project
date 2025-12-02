import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Brain,
  PlayCircle,
  Activity,
  Database,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Trash2,
  Download,
  Upload,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

function AdminSystem() {
  // AI 모델 학습 상태
  const [trainingStatus, setTrainingStatus] = useState({
    isTraining: false,
    progress: 0,
    currentEpoch: 0,
    totalEpochs: 0,
    status: 'idle', // idle, training, completed, error
    startTime: null,
    endTime: null,
  });

  // 학습 설정
  const [trainingConfig, setTrainingConfig] = useState({
    modelName: '',
    epochs: 10,
    batchSize: 32,
    learningRate: 0.001,
    description: '',
  });

  // 학습된 모델 목록 (Mock 데이터)
  const [trainedModels, setTrainedModels] = useState([
    {
      id: 1,
      name: 'Restaurant Recommendation Model v3.2',
      version: 'v3.2',
      trainedAt: '2024-11-28 14:30:00',
      accuracy: 94.5,
      status: 'active',
      dataSize: '15,234개',
      epochs: 50,
      description: '사용자 취향 기반 맛집 추천 모델',
    },
    {
      id: 2,
      name: 'Restaurant Recommendation Model v3.1',
      version: 'v3.1',
      trainedAt: '2024-11-25 10:15:00',
      accuracy: 92.8,
      status: 'inactive',
      dataSize: '14,891개',
      epochs: 50,
      description: '이전 버전 모델',
    },
    {
      id: 3,
      name: 'Restaurant Recommendation Model v3.0',
      version: 'v3.0',
      trainedAt: '2024-11-20 16:45:00',
      accuracy: 91.2,
      status: 'archived',
      dataSize: '13,567개',
      epochs: 30,
      description: '초기 학습 모델',
    },
  ]);

  // 학습 로그 (Mock 데이터)
  const [trainingLogs, setTrainingLogs] = useState([
    {
      id: 1,
      timestamp: '2024-11-28 14:30:00',
      type: 'success',
      message: 'Model v3.2 학습 완료 - Accuracy: 94.5%',
    },
    {
      id: 2,
      timestamp: '2024-11-28 14:25:00',
      type: 'info',
      message: 'Epoch 50/50 완료',
    },
    {
      id: 3,
      timestamp: '2024-11-28 14:00:00',
      type: 'info',
      message: 'Model v3.2 학습 시작',
    },
    {
      id: 4,
      timestamp: '2024-11-25 10:15:00',
      type: 'success',
      message: 'Model v3.1 학습 완료 - Accuracy: 92.8%',
    },
  ]);

  // 학습 시작
  const handleStartTraining = () => {
    if (!trainingConfig.modelName.trim()) {
      toast.error('모델 이름을 입력해주세요');
      return;
    }

    // 학습 시뮬레이션
    setTrainingStatus({
      isTraining: true,
      progress: 0,
      currentEpoch: 0,
      totalEpochs: trainingConfig.epochs,
      status: 'training',
      startTime: new Date(),
      endTime: null,
    });

    toast.success('AI 모델 학습을 시작합니다');

    // 실제로는 백엔드 API 호출
    // API: POST /api/admin/ai/train
    console.log('Training started with config:', trainingConfig);
  };

  // 학습 중단
  const handleStopTraining = () => {
    setTrainingStatus({
      ...trainingStatus,
      isTraining: false,
      status: 'idle',
    });
    toast.warning('학습이 중단되었습니다');
  };

  // 모델 활성화
  const handleActivateModel = (modelId) => {
    setTrainedModels((prev) =>
      prev.map((model) => ({
        ...model,
        status: model.id === modelId ? 'active' : 'inactive',
      }))
    );
    toast.success('모델이 활성화되었습니다');
  };

  // 모델 삭제
  const handleDeleteModel = (modelId) => {
    if (confirm('정말로 이 모델을 삭제하시겠습니까?')) {
      setTrainedModels((prev) => prev.filter((model) => model.id !== modelId));
      toast.success('모델이 삭제되었습니다');
    }
  };

  // 상태 조회 새로고침
  const handleRefreshStatus = () => {
    toast.success('학습 상태가 새로고침되었습니다');
    // 실제로는 백엔드 API 호출
    // API: GET /api/admin/ai/training-status
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: { color: 'bg-green-500', label: '활성' },
      inactive: { color: 'bg-gray-500', label: '비활성' },
      archived: { color: 'bg-blue-500', label: '보관' },
      training: { color: 'bg-orange-500', label: '학습중' },
      error: { color: 'bg-red-500', label: '오류' },
    };
    const variant = variants[status] || variants.inactive;
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          시스템 관리
        </h1>
        <p className="text-muted-foreground">
          AI 모델 학습, 학습 상태 조회 및 학습된 모델을 관리합니다
        </p>
      </motion.div>

      <Tabs defaultValue="train" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="train">
            <Brain className="h-4 w-4 mr-2" />
            모델 학습
          </TabsTrigger>
          <TabsTrigger value="status">
            <Activity className="h-4 w-4 mr-2" />
            학습 상태
          </TabsTrigger>
          <TabsTrigger value="models">
            <Database className="h-4 w-4 mr-2" />
            학습된 모델
          </TabsTrigger>
        </TabsList>

        {/* AI 모델 학습 탭 */}
        <TabsContent value="train">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-orange-600" />
                  새로운 AI 모델 학습
                </CardTitle>
                <CardDescription>
                  학습 데이터를 기반으로 새로운 맛집 추천 AI 모델을 생성합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 학습 설정 폼 */}
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="modelName">모델 이름 *</Label>
                      <Input
                        id="modelName"
                        placeholder="예: Restaurant Model v4.0"
                        value={trainingConfig.modelName}
                        onChange={(e) =>
                          setTrainingConfig({
                            ...trainingConfig,
                            modelName: e.target.value,
                          })
                        }
                        disabled={trainingStatus.isTraining}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="epochs">에폭 수</Label>
                      <Input
                        id="epochs"
                        type="number"
                        placeholder="10"
                        value={trainingConfig.epochs}
                        onChange={(e) =>
                          setTrainingConfig({
                            ...trainingConfig,
                            epochs: parseInt(e.target.value) || 10,
                          })
                        }
                        disabled={trainingStatus.isTraining}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="batchSize">배치 크기</Label>
                      <Input
                        id="batchSize"
                        type="number"
                        placeholder="32"
                        value={trainingConfig.batchSize}
                        onChange={(e) =>
                          setTrainingConfig({
                            ...trainingConfig,
                            batchSize: parseInt(e.target.value) || 32,
                          })
                        }
                        disabled={trainingStatus.isTraining}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="learningRate">학습률</Label>
                      <Input
                        id="learningRate"
                        type="number"
                        step="0.0001"
                        placeholder="0.001"
                        value={trainingConfig.learningRate}
                        onChange={(e) =>
                          setTrainingConfig({
                            ...trainingConfig,
                            learningRate: parseFloat(e.target.value) || 0.001,
                          })
                        }
                        disabled={trainingStatus.isTraining}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">모델 설명</Label>
                    <Textarea
                      id="description"
                      placeholder="모델에 대한 설명을 입력하세요"
                      rows={3}
                      value={trainingConfig.description}
                      onChange={(e) =>
                        setTrainingConfig({
                          ...trainingConfig,
                          description: e.target.value,
                        })
                      }
                      disabled={trainingStatus.isTraining}
                    />
                  </div>
                </div>

                {/* 학습 진행 상태 */}
                {trainingStatus.isTraining && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-lg border border-orange-200 bg-orange-50/30"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="h-5 w-5 text-orange-600 animate-pulse" />
                      <span className="font-medium">학습 진행중...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          에폭: {trainingStatus.currentEpoch} / {trainingStatus.totalEpochs}
                        </span>
                        <span>{trainingStatus.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${trainingStatus.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 액션 버튼 */}
                <div className="flex gap-3">
                  {!trainingStatus.isTraining ? (
                    <Button
                      onClick={handleStartTraining}
                      className="bg-gradient-to-r from-orange-600 to-red-600"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      학습 시작
                    </Button>
                  ) : (
                    <Button onClick={handleStopTraining} variant="destructive">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      학습 중단
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() =>
                      setTrainingConfig({
                        modelName: '',
                        epochs: 10,
                        batchSize: 32,
                        learningRate: 0.001,
                        description: '',
                      })
                    }
                    disabled={trainingStatus.isTraining}
                  >
                    초기화
                  </Button>
                </div>

                {/* 학습 가이드 */}
                <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200">
                  <h4 className="font-medium mb-2 text-blue-900">💡 학습 가이드</h4>
                  <ul className="space-y-1 text-blue-700 list-disc list-inside">
                    <li>에폭 수: 일반적으로 30-100 사이 권장</li>
                    <li>배치 크기: 16, 32, 64 중 선택 권장</li>
                    <li>학습률: 0.0001 ~ 0.01 범위 권장</li>
                    <li>학습 데이터가 많을수록 정확도가 향상됩니다</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* 학습 상태 조회 탭 */}
        <TabsContent value="status">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 현재 학습 상태 */}
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  현재 학습 상태
                </CardTitle>
                <Button onClick={handleRefreshStatus} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  새로고침
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      <span className="text-muted-foreground">상태</span>
                    </div>
                    <div className="mt-2">
                      {getStatusBadge(trainingStatus.status)}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-muted-foreground">진행률</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl">{trainingStatus.progress}%</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground">현재 에폭</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl">
                        {trainingStatus.currentEpoch}/{trainingStatus.totalEpochs}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-orange-500" />
                      <span className="text-muted-foreground">데이터 크기</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl">15,234개</span>
                    </div>
                  </div>
                </div>

                {trainingStatus.startTime && (
                  <div className="mt-4 p-4 rounded-lg bg-gray-50">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground">시작 시간: </span>
                        <span>{trainingStatus.startTime.toLocaleString('ko-KR')}</span>
                      </div>
                      {trainingStatus.endTime && (
                        <div>
                          <span className="text-muted-foreground">종료 시간: </span>
                          <span>{trainingStatus.endTime.toLocaleString('ko-KR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 학습 로그 */}
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader>
                <CardTitle>학습 로그</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>시간</TableHead>
                      <TableHead>타입</TableHead>
                      <TableHead>메시지</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainingLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-muted-foreground">
                          {log.timestamp}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getLogIcon(log.type)}
                          </div>
                        </TableCell>
                        <TableCell>{log.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* 학습된 AI 모델 조회 탭 */}
        <TabsContent value="models">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-orange-600" />
                  학습된 AI 모델 목록
                </CardTitle>
                <CardDescription>
                  학습 완료된 모델을 조회하고 관리합니다 ({trainedModels.length}개)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainedModels.map((model, index) => (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-gray-200 hover:border-orange-200 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium">{model.name}</h3>
                            {getStatusBadge(model.status)}
                          </div>
                          <p className="text-muted-foreground mb-3">
                            {model.description}
                          </p>
                          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">버전: </span>
                              <span className="font-medium">{model.version}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">정확도: </span>
                              <span className="font-medium text-green-600">
                                {model.accuracy}%
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">데이터: </span>
                              <span className="font-medium">{model.dataSize}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">에폭: </span>
                              <span className="font-medium">{model.epochs}</span>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            학습 완료: {model.trainedAt}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {model.status !== 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleActivateModel(model.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              활성화
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteModel(model.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* 정확도 시각화 */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">정확도</span>
                          <span className="font-medium">{model.accuracy}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              model.status === 'active'
                                ? 'bg-gradient-to-r from-orange-500 to-red-500'
                                : 'bg-gray-400'
                            }`}
                            style={{ width: `${model.accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {trainedModels.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>학습된 AI 모델이 없습니다</p>
                    <p className="text-sm mt-1">모델 학습 탭에서 새 모델을 학습하세요</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminSystem;
