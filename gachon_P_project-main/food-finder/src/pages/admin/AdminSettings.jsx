import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Shield, Database, Mail, Bell, Palette } from 'lucide-react';
import { motion } from 'motion/react';

function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Food Finder',
    siteDescription: 'AI 기반 맛집 추천 서비스',
    maintenanceMode: false,
    allowSignup: true,
    emailNotifications: true,
    pushNotifications: true,
    autoApproveReviews: false,
    maxUploadSize: 10,
    sessionTimeout: 30,
  });

  const handleSave = () => {
    alert('설정이 저장되었습니다!');
  };

  const settingSections = [
    {
      title: '기본 설정',
      icon: Settings,
      color: 'text-orange-600',
      items: [
        { key: 'siteName', label: '서비스 이름', type: 'text' },
        { key: 'siteDescription', label: '서비스 설명', type: 'text' },
      ],
    },
    {
      title: '보안 설정',
      icon: Shield,
      color: 'text-red-600',
      items: [
        { key: 'maintenanceMode', label: '점검 모드', type: 'switch' },
        { key: 'allowSignup', label: '회원가입 허용', type: 'switch' },
        { key: 'sessionTimeout', label: '세션 타임아웃 (분)', type: 'number' },
      ],
    },
    {
      title: '알림 설정',
      icon: Bell,
      color: 'text-blue-600',
      items: [
        { key: 'emailNotifications', label: '이메일 알림', type: 'switch' },
        { key: 'pushNotifications', label: '푸시 알림', type: 'switch' },
      ],
    },
    {
      title: '콘텐츠 설정',
      icon: Database,
      color: 'text-green-600',
      items: [
        { key: 'autoApproveReviews', label: '리뷰 자동 승인', type: 'switch' },
        { key: 'maxUploadSize', label: '최대 업로드 크기 (MB)', type: 'number' },
      ],
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
          설정
        </h1>
        <p className="text-muted-foreground">
          시스템 전반의 설정을 관리합니다
        </p>
      </motion.div>

      {/* 설정 섹션 */}
      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className={`h-5 w-5 ${section.color}`} />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.key}>
                    {item.type === 'switch' ? (
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor={item.key} className="cursor-pointer">
                          {item.label}
                        </Label>
                        <Switch
                          id={item.key}
                          checked={settings[item.key]}
                          onCheckedChange={(checked) =>
                            setSettings({ ...settings, [item.key]: checked })
                          }
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor={item.key}>{item.label}</Label>
                        <Input
                          id={item.key}
                          type={item.type}
                          value={settings[item.key]}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              [item.key]:
                                item.type === 'number'
                                  ? parseInt(e.target.value) || 0
                                  : e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 저장 버튼 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                onClick={handleSave}
              >
                <Settings className="mr-2 h-4 w-4" />
                설정 저장
              </Button>
              <Button variant="outline" className="flex-1">
                초기화
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 시스템 정보 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-orange-600" />
              시스템 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">버전</span>
                <span>v1.0.0</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">서버 상태</span>
                <span className="text-green-600">정상</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">데이터베이스</span>
                <span className="text-green-600">연결됨</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">스토리지 사용량</span>
                <span>234 MB / 10 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">마지막 백업</span>
                <span>2024-01-16 03:00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminSettings;
