import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Bell, Send, Trash2, Eye, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

function AdminNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: '신규 이벤트 안내',
      message: '1월 이벤트가 시작되었습니다.',
      targetRole: 'owner',
      status: 'sent',
      sentDate: '2024-01-15 10:30',
      recipients: 45,
    },
    {
      id: 2,
      title: '시스템 점검 공지',
      message: '1월 20일 새벽 2시~4시 시스템 점검이 있습니다.',
      targetRole: 'all',
      status: 'scheduled',
      sentDate: '2024-01-20 02:00',
      recipients: 1248,
    },
    {
      id: 3,
      title: '리뷰 작성 안내',
      message: '최근 방문한 맛집의 리뷰를 작성해주세요.',
      targetRole: 'user',
      status: 'draft',
      sentDate: '-',
      recipients: 0,
    },
  ]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    targetRole: 'all',
  });

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    
    const notification = {
      id: notifications.length + 1,
      ...newNotification,
      status: 'sent',
      sentDate: new Date().toLocaleString('ko-KR'),
      recipients: newNotification.targetRole === 'all' ? 1248 : newNotification.targetRole === 'owner' ? 45 : 1203,
    };
    
    setNotifications([notification, ...notifications]);
    setNewNotification({ title: '', message: '', targetRole: 'all' });
  };

  const getStatusBadge = (status) => {
    const variants = {
      sent: { variant: 'default', label: '발송완료', color: 'border-green-500 text-green-600' },
      scheduled: { variant: 'outline', label: '예약', color: 'border-blue-500 text-blue-600' },
      draft: { variant: 'outline', label: '임시저장', color: 'border-gray-500 text-gray-600' },
    };
    const config = variants[status];
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getTargetBadge = (role) => {
    const labels = {
      all: '전체',
      owner: '시설자',
      user: '일반 사용자',
    };
    return <Badge variant="secondary">{labels[role]}</Badge>;
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
          시설자 알림 관리
        </h1>
        <p className="text-muted-foreground">
          사용자 및 시설자에게 푸시 알림을 전송하고 관리합니다
        </p>
      </motion.div>

      {/* 새 알림 작성 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              새 알림 작성
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm">알림 제목</label>
              <Input
                placeholder="알림 제목을 입력하세요"
                value={newNotification.title}
                onChange={(e) =>
                  setNewNotification({ ...newNotification, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm">알림 내용</label>
              <Textarea
                placeholder="알림 내용을 입력하세요"
                rows={4}
                value={newNotification.message}
                onChange={(e) =>
                  setNewNotification({ ...newNotification, message: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm">대상</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={newNotification.targetRole}
                onChange={(e) =>
                  setNewNotification({ ...newNotification, targetRole: e.target.value })
                }
              >
                <option value="all">전체 사용자</option>
                <option value="owner">시설자만</option>
                <option value="user">일반 사용자만</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                onClick={handleSendNotification}
              >
                <Send className="mr-2 h-4 w-4" />
                즉시 발송
              </Button>
              <Button variant="outline" className="flex-1">
                <Calendar className="mr-2 h-4 w-4" />
                예약 발송
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 알림 내역 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle>알림 발송 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>대상</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>수신자</TableHead>
                  <TableHead>발송일시</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div>
                        <p>{notification.title}</p>
                        <p className="text-muted-foreground line-clamp-1">
                          {notification.message}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getTargetBadge(notification.targetRole)}</TableCell>
                    <TableCell>{getStatusBadge(notification.status)}</TableCell>
                    <TableCell>
                      {notification.recipients > 0
                        ? `${notification.recipients}명`
                        : '-'}
                    </TableCell>
                    <TableCell>{notification.sentDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminNotifications;
