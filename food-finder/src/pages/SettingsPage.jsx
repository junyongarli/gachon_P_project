import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, Bell, Shield, Palette } from 'lucide-react';
import { motion } from 'framer-motion'; // motion/react -> framer-motion (라이브러리명 확인 필요)
import { useAuth } from '@/contexts/AuthContext';

function SettingsPage() {
  // useAuth에서 user 정보와 token, logout 함수를 가져옵니다.
  const { user, token, logout } = useAuth();

  // 계정 설정 상태
  const [accountSettings, setAccountSettings] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 서비스 설정 상태
  const [serviceSettings, setServiceSettings] = useState({
    emailNotification: true,
    pushNotification: false,
    reviewNotification: true,
    marketingEmail: false,
    locationService: true,
  });

  // [기능 1] 정보 업데이트 (데모)
  const handleAccountUpdate = () => {
    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }
    alert('계정 정보가 업데이트되었습니다. (데모 기능)');
  };

  // [기능 2] 비밀번호 변경 (API 연동)
  const handlePasswordChange = async () => {
    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = accountSettings;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('모든 비밀번호 필드를 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 토큰 전송
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('비밀번호가 변경되었습니다. 보안을 위해 다시 로그인해주세요.');
        
        // 입력 필드 초기화
        setAccountSettings({
          ...accountSettings,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

        // 로그아웃 처리
        if (logout) logout();
        else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
      } else {
        alert(data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 변경 에러:', error);
      alert('서버 통신 중 오류가 발생했습니다.');
    }
  };

  const handleServiceSettingsUpdate = () => {
    alert('서비스 설정이 저장되었습니다.');
  };

  // [기능 3] 회원 탈퇴 (API 연동)
  const handleAccountDelete = async () => {
    if (!user) return;

    if (confirm('정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다.')) {
      try {
        const response = await fetch('/api/auth/delete-account', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}` // 토큰 전송
          }
        });

        const data = await response.json();

        if (data.success) {
          alert('회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
          if (logout) logout();
          else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
          }
        } else {
          alert(data.message || '회원 탈퇴에 실패했습니다.');
        }
      } catch (error) {
        console.error('회원 탈퇴 에러:', error);
        alert('서버 통신 중 오류가 발생했습니다.');
      }
    }
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
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold">
                설정
              </h1>
              <p className="text-gray-600 mt-1">계정 및 서비스 설정을 관리하세요</p>
            </div>
          </div>
        </motion.div>

        {/* 설정 내용 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {user ? (
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 mb-6">
                <TabsTrigger value="account">계정 설정</TabsTrigger>
                <TabsTrigger value="service">서비스 설정</TabsTrigger>
              </TabsList>

              {/* 계정 설정 탭 */}
              <TabsContent value="account" className="space-y-6">
                {/* 기본 정보 */}
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <User className="w-5 h-5 text-orange-500" />
                      <h3 className="text-xl text-gray-800 font-bold">기본 정보</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username">사용자 이름</Label>
                        <Input
                          id="username"
                          type="text"
                          value={accountSettings.username}
                          disabled
                          className="mt-2 bg-gray-100 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">이메일</Label>
                        <Input
                          id="email"
                          type="email"
                          value={accountSettings.email}
                          disabled
                          className="mt-2 bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                      
                      {/* <Button
                        onClick={handleAccountUpdate}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      >
                        정보 업데이트
                      </Button> 
                      */}
                    </div>
                  </CardContent>
                </Card>

                {/* 비밀번호 변경 */}
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Shield className="w-5 h-5 text-orange-500" />
                      <h3 className="text-xl text-gray-800 font-bold">비밀번호 변경</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">현재 비밀번호</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={accountSettings.currentPassword}
                          onChange={(e) => setAccountSettings({ ...accountSettings, currentPassword: e.target.value })}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="newPassword">새 비밀번호</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={accountSettings.newPassword}
                          onChange={(e) => setAccountSettings({ ...accountSettings, newPassword: e.target.value })}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={accountSettings.confirmPassword}
                          onChange={(e) => setAccountSettings({ ...accountSettings, confirmPassword: e.target.value })}
                          className="mt-2"
                        />
                      </div>

                      <Button
                        onClick={handlePasswordChange}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      >
                        비밀번호 변경
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 회원 탈퇴 */}
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-red-200">
                  <CardContent className="p-6">
                    <h3 className="text-xl text-gray-800 font-bold mb-2">회원 탈퇴</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                    </p>
                    <Button
                      onClick={handleAccountDelete}
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      회원 탈퇴
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 서비스 설정 탭 */}
              <TabsContent value="service" className="space-y-6">
                {/* 알림 설정 */}
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Bell className="w-5 h-5 text-orange-500" />
                      <h3 className="text-xl text-gray-800 font-bold">알림 설정</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-gray-800 font-medium">이메일 알림</p>
                          <p className="text-sm text-gray-500">새로운 소식을 이메일로 받습니다</p>
                        </div>
                        <Switch
                          checked={serviceSettings.emailNotification}
                          onCheckedChange={(checked) => setServiceSettings({ ...serviceSettings, emailNotification: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-gray-800 font-medium">푸시 알림</p>
                          <p className="text-sm text-gray-500">실시간 알림을 받습니다</p>
                        </div>
                        <Switch
                          checked={serviceSettings.pushNotification}
                          onCheckedChange={(checked) => setServiceSettings({ ...serviceSettings, pushNotification: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-gray-800 font-medium">리뷰 알림</p>
                          <p className="text-sm text-gray-500">새로운 리뷰 알림을 받습니다</p>
                        </div>
                        <Switch
                          checked={serviceSettings.reviewNotification}
                          onCheckedChange={(checked) => setServiceSettings({ ...serviceSettings, reviewNotification: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-gray-800 font-medium">마케팅 이메일</p>
                          <p className="text-sm text-gray-500">프로모션 정보를 받습니다</p>
                        </div>
                        <Switch
                          checked={serviceSettings.marketingEmail}
                          onCheckedChange={(checked) => setServiceSettings({ ...serviceSettings, marketingEmail: checked })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 기타 설정 */}
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Palette className="w-5 h-5 text-orange-500" />
                      <h3 className="text-xl text-gray-800 font-bold">기타 설정</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-gray-800 font-medium">위치 서비스</p>
                          <p className="text-sm text-gray-500">주변 맛집 추천을 위해 사용됩니다</p>
                        </div>
                        <Switch
                          checked={serviceSettings.locationService}
                          onCheckedChange={(checked) => setServiceSettings({ ...serviceSettings, locationService: checked })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleServiceSettingsUpdate}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  설정 저장
                </Button>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardContent className="p-12 text-center">
                <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-4">로그인이 필요한 서비스입니다</p>
                <p className="text-gray-500 mb-6">설정을 변경하려면 로그인해주세요</p>
                <a href="/login">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                    로그인하러 가기
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}
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

export default SettingsPage;