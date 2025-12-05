import { useState, useEffect } from 'react';
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
  FileJson, 
  Loader2,  
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

function AdminSystem() {
  // AI 모델 학습 상태
  const [trainingStatus, setTrainingStatus] = useState({
    isTraining: false,
    progress: 0,
    status: 'idle', 
    startTime: null,
    endTime: null,
    jobId: null, 
  });

  // 학습 설정
  const [trainingConfig, setTrainingConfig] = useState({
    modelName: '',
    epochs: 3, 
    description: '',
  });

  // 파일 선택 상태
  const [selectedFile, setSelectedFile] = useState(null);

  // [수정] 학습된 모델 목록 (초기값 빈 배열)
  const [trainedModels, setTrainedModels] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // 학습 로그
  const [trainingLogs, setTrainingLogs] = useState([]);

  // [추가] 컴포넌트 마운트 시 모델 목록 불러오기
  useEffect(() => {
    fetchModels();
  }, []);

  // [추가] 모델 목록 조회 함수
  const fetchModels = async () => {
    setIsLoadingModels(true);
    try {
      // API 호출 (토큰이 필요하다면 headers에 추가)
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/ai/models', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setTrainedModels(data.models);
      } else {
        toast.error("모델 목록을 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("모델 로딩 실패:", error);
      toast.error("서버 연결 실패");
    } finally {
      setIsLoadingModels(false);
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.endsWith('.jsonl')) {
        toast.error('반드시 .jsonl 형식의 파일이어야 합니다.');
        e.target.value = '';
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      toast.success(`파일이 선택되었습니다: ${file.name}`);
    }
  };

  // 학습 시작 (API 호출)
  const handleStartTraining = async () => {
    if (!trainingConfig.modelName.trim()) {
      toast.error('모델 이름을 입력해주세요');
      return;
    }
    if (!selectedFile) {
      toast.error('학습 데이터 파일(.jsonl)을 선택해주세요');
      return;
    }

    setTrainingStatus({
      ...trainingStatus,
      isTraining: true,
      status: 'uploading',
      progress: 10,
      startTime: new Date(),
    });

    toast.info('데이터 업로드 및 학습 시작 요청 중...');

    try {
      const formData = new FormData();
      formData.append('trainingFile', selectedFile);
      formData.append('modelName', trainingConfig.modelName);
      formData.append('epochs', trainingConfig.epochs);
      
      const token = localStorage.getItem('token'); 
      const response = await fetch('/api/admin/ai/train', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || '학습 요청 실패');

      toast.success(`학습 작업이 시작되었습니다! (Job ID: ${data.jobId})`);
      
      setTrainingStatus(prev => ({
        ...prev,
        status: 'training',
        jobId: data.jobId,
        progress: 20, 
      }));

      // 로그 추가
      setTrainingLogs(prev => [{
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        type: 'info',
        message: `Job Started: ${data.jobId} (Model: ${trainingConfig.modelName})`
      }, ...prev]);

      // 탭을 '학습 상태'로 자동 이동시키는 로직을 추가할 수도 있습니다.

    } catch (error) {
      console.error(error);
      toast.error(`오류 발생: ${error.message}`);
      setTrainingStatus(prev => ({ ...prev, isTraining: false, status: 'failed' }));
    }
  };

  // 학습 중단
  const handleStopTraining = () => {
    if(confirm("학습 상태 모니터링을 중단하시겠습니까? (실제 학습은 백그라운드에서 계속될 수 있습니다)")) {
        setTrainingStatus({
        ...trainingStatus,
        isTraining: false,
        status: 'idle',
        });
        toast.warning('모니터링이 중단되었습니다');
    }
  };

  // 상태 조회 새로고침
  const handleRefreshStatus = async () => {
    if (!trainingStatus.jobId) {
        toast.info("현재 추적 중인 학습 작업이 없습니다.");
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/ai/jobs/${trainingStatus.jobId}`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        let progressPercent = trainingStatus.progress;
        if (data.status === 'running') progressPercent = 50;
        if (data.status === 'succeeded') progressPercent = 100;

        setTrainingStatus(prev => ({
            ...prev,
            status: data.status,
            progress: progressPercent,
            fine_tuned_model: data.fine_tuned_model
        }));

        if (data.status === 'succeeded') {
            toast.success("AI 모델 학습이 완료되었습니다!");
            // 완료 시 목록 새로고침
            fetchModels(); 
            setTrainingStatus(prev => ({ ...prev, isTraining: false, endTime: new Date() }));
        } else if (data.status === 'failed') {
            toast.error("학습이 실패했습니다.");
            setTrainingStatus(prev => ({ ...prev, isTraining: false }));
        } else {
            toast.info(`현재 상태: ${data.status}`);
        }

    } catch (error) {
        console.error(error);
        toast.error("상태 조회 실패");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: { color: 'bg-green-100 text-green-800 border-green-200', label: '사용가능' },
      succeeded: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: '성공' },
      running: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: '학습중' },
      failed: { color: 'bg-red-100 text-red-800 border-red-200', label: '실패' },
      cancelled: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: '취소됨' },
    };
    // active 상태가 아니면 OpenAI status 그대로 매핑
    const variant = variants[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return <Badge variant="outline" className={`${variant.color} border`}>{variant.label}</Badge>;
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent text-3xl font-bold">
          AI 시스템 관리
        </h1>
        <p className="text-muted-foreground">
          OpenAI 파인튜닝(Fine-tuning)을 수행하고 학습된 모델 버전을 관리합니다.
        </p>
      </motion.div>

      <Tabs defaultValue="models" className="space-y-6"> {/* 기본 탭을 models로 변경하여 바로 확인 가능하게 함 */}
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-orange-100/50">
          <TabsTrigger value="train" className="data-[state=active]:bg-white data-[state=active]:text-orange-700">
            <Brain className="h-4 w-4 mr-2" />
            모델 학습
          </TabsTrigger>
          <TabsTrigger value="status" className="data-[state=active]:bg-white data-[state=active]:text-orange-700">
            <Activity className="h-4 w-4 mr-2" />
            학습 상태
          </TabsTrigger>
          <TabsTrigger value="models" className="data-[state=active]:bg-white data-[state=active]:text-orange-700">
            <Database className="h-4 w-4 mr-2" />
            모델 목록
          </TabsTrigger>
        </TabsList>

        {/* 1. AI 모델 학습 탭 */}
        <TabsContent value="train">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 md:grid-cols-1 lg:grid-cols-3"
          >
            {/* 왼쪽: 학습 설정 폼 */}
            <Card className="lg:col-span-2 backdrop-blur-sm bg-white/80 border-orange-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-orange-600" />
                  파인튜닝 작업 생성
                </CardTitle>
                <CardDescription>
                  준비된 JSONL 파일을 업로드하여 GPT 모델을 학습시킵니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="modelName">모델 식별 이름 *</Label>
                      <Input
                        id="modelName"
                        placeholder="예: MatMap Recommendation v2"
                        value={trainingConfig.modelName}
                        onChange={(e) => setTrainingConfig({ ...trainingConfig, modelName: e.target.value })}
                        disabled={trainingStatus.isTraining}
                        className="focus-visible:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="epochs">학습 에폭 (Epochs)</Label>
                      <Input
                        id="epochs"
                        type="number"
                        placeholder="기본값: 3"
                        value={trainingConfig.epochs}
                        onChange={(e) => setTrainingConfig({ ...trainingConfig, epochs: e.target.value })}
                        disabled={trainingStatus.isTraining}
                      />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="trainingFile" className="flex items-center gap-2">
                        학습 데이터 파일 (.jsonl) *
                        <Badge variant="outline" className="text-xs font-normal">필수</Badge>
                    </Label>
                    <div className="flex items-center gap-4">
                        <Input
                            id="trainingFile"
                            type="file"
                            accept=".jsonl"
                            onChange={handleFileChange}
                            disabled={trainingStatus.isTraining}
                            className="cursor-pointer file:text-orange-600 file:font-semibold hover:file:bg-orange-50"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        * OpenAI 파인튜닝 포맷(JSONL)을 준수해야 합니다.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">모델 설명 (선택)</Label>
                    <Textarea
                      id="description"
                      placeholder="이 모델의 학습 목적이나 데이터 특징을 기록하세요."
                      rows={3}
                      value={trainingConfig.description}
                      onChange={(e) => setTrainingConfig({ ...trainingConfig, description: e.target.value })}
                      disabled={trainingStatus.isTraining}
                    />
                </div>

                {trainingStatus.isTraining && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-lg border border-orange-200 bg-orange-50/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {trainingStatus.status === 'uploading' ? (
                            <Loader2 className="h-4 w-4 text-orange-600 animate-spin" />
                        ) : (
                            <Activity className="h-4 w-4 text-orange-600 animate-pulse" />
                        )}
                        <span className="font-medium text-sm text-orange-900">
                            {trainingStatus.status === 'uploading' ? '데이터 업로드 중...' : 'OpenAI 학습 진행 중...'}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-orange-600">{trainingStatus.progress}% (추정)</span>
                    </div>
                    <div className="w-full bg-orange-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000 ease-in-out"
                        style={{ width: `${trainingStatus.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-right">
                        Job ID: {trainingStatus.jobId}
                    </p>
                  </motion.div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setTrainingConfig({ modelName: '', epochs: 3, description: '' })}
                    disabled={trainingStatus.isTraining}
                  >
                    초기화
                  </Button>
                  {!trainingStatus.isTraining ? (
                    <Button onClick={handleStartTraining} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white min-w-[120px]">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      학습 시작
                    </Button>
                  ) : (
                    <Button onClick={handleStopTraining} variant="destructive">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      중단
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 오른쪽: 데이터 가이드 */}
            <Card className="border-blue-100 bg-blue-50/30">
                <CardHeader>
                    <CardTitle className="text-base text-blue-900 flex items-center gap-2">
                        <FileJson className="h-4 w-4" />
                        데이터 포맷 가이드
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-4">
                    <div className="p-3 bg-white rounded border border-blue-100 text-xs font-mono text-slate-600 overflow-x-auto">
                        <span className="text-green-600">{"{"}</span><br/>
                        &nbsp;&nbsp;"messages": [<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-600">{"{"}</span>"role": "system", "content": "..."<span className="text-blue-600">{"}"}</span>,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-600">{"{"}</span>"role": "user", "content": "..."<span className="text-blue-600">{"}"}</span>,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-600">{"{"}</span>"role": "assistant", "content": "..."<span className="text-blue-600">{"}"}</span><br/>
                        &nbsp;&nbsp;]<br/>
                        <span className="text-green-600">{"}"}</span>
                    </div>
                    <ul className="space-y-2 text-blue-800 list-disc list-inside text-xs">
                        <li>반드시 <strong>JSONL</strong> 형식이어야 합니다.</li>
                        <li><strong>System:</strong> AI의 페르소나 설정</li>
                        <li><strong>User:</strong> 사용자 예상 질문</li>
                        <li><strong>Assistant:</strong> AI의 이상적인 답변</li>
                    </ul>
                </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* 2. 학습 상태 조회 탭 */}
        <TabsContent value="status">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="backdrop-blur-sm bg-white/80 border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-orange-600" />
                    실시간 학습 모니터링
                    </CardTitle>
                    <CardDescription>Job ID: {trainingStatus.jobId || '진행 중인 작업 없음'}</CardDescription>
                </div>
                <Button onClick={handleRefreshStatus} variant="outline" size="sm" className="hover:bg-orange-50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  상태 새로고침
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4 mt-4">
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">상태 (Status)</div>
                    <div className="mt-1 text-lg font-semibold">{getStatusBadge(trainingStatus.status)}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">진행률 (Progress)</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900">{trainingStatus.progress}%</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">시작 시간</div>
                    <div className="mt-1 font-medium text-gray-900">{trainingStatus.startTime ? trainingStatus.startTime.toLocaleTimeString() : '-'}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">결과 모델 ID</div>
                    <div className="mt-1 text-xs font-mono text-gray-600 break-all">{trainingStatus.fine_tuned_model || '생성 대기중...'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader>
                <CardTitle className="text-base">시스템 로그</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">시간</TableHead>
                      <TableHead className="w-[80px]">유형</TableHead>
                      <TableHead>메시지</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainingLogs.length > 0 ? (
                        trainingLogs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell className="text-xs text-muted-foreground font-mono">{log.timestamp}</TableCell>
                            <TableCell><div className="flex items-center justify-center">{getLogIcon(log.type)}</div></TableCell>
                            <TableCell className="text-sm">{log.message}</TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">기록된 로그가 없습니다.</TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* 3. 학습된 모델 목록 탭 */}
        <TabsContent value="models">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-orange-600" />
                    학습된 AI 모델 관리
                    </CardTitle>
                    <CardDescription>OpenAI에서 파인튜닝된 모델 목록입니다.</CardDescription>
                </div>
                <Button onClick={fetchModels} variant="outline" size="sm" disabled={isLoadingModels}>
                    {isLoadingModels ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainedModels.length > 0 ? (
                      trainedModels.map((model, index) => (
                        <motion.div
                          key={model.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-5 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all bg-white"
                        >
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="font-bold text-lg text-gray-800">{model.name || 'Unnamed Model'}</h3>
                                {getStatusBadge(model.status)}
                                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                    {model.id}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{model.description}</p>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {model.trainedAt}</span>
                                <span className="flex items-center gap-1"><Database className="h-3 w-3" /> {model.dataSize}</span>
                                <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Epochs: {model.epochs}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {model.status === 'active' || model.status === 'succeeded' ? (
                                <Button size="sm" variant="outline" className="hover:bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  활성 모델
                                </Button>
                              ) : (
                                <Button size="sm" variant="secondary" disabled className="opacity-70">
                                    준비중
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                  ) : (
                    <div className="text-center py-16 text-muted-foreground bg-gray-50/50 rounded-lg border-dashed border-2 border-gray-200">
                        {isLoadingModels ? (
                            <div className="flex flex-col items-center">
                                <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-2" />
                                <p>모델 목록을 불러오는 중...</p>
                            </div>
                        ) : (
                            <>
                                <Database className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>학습된 AI 모델이 없습니다</p>
                                <p className="text-sm mt-1">모델 학습 탭에서 새 모델을 학습하세요</p>
                            </>
                        )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminSystem;