import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MessageSquare, ThumbsUp, Eye, Trash2, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { motion } from 'motion/react';

function AdminCommunity() {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: '강남 맛집 추천 부탁드립니다!',
      author: '홍길동',
      category: '질문',
      views: 234,
      likes: 12,
      comments: 8,
      status: 'approved',
      createdAt: '2024-01-15 10:30',
      reported: false,
    },
    {
      id: 2,
      title: '이탈리안 레스토랑 방문 후기',
      author: '김철수',
      category: '후기',
      views: 456,
      likes: 34,
      comments: 15,
      status: 'approved',
      createdAt: '2024-01-14 15:20',
      reported: false,
    },
    {
      id: 3,
      title: '불쾌한 내용이 포함된 게시글',
      author: '악성유저',
      category: '기타',
      views: 12,
      likes: 0,
      comments: 2,
      status: 'pending',
      createdAt: '2024-01-16 09:10',
      reported: true,
    },
    {
      id: 4,
      title: '맛집 이벤트 안내',
      author: '이영희',
      category: '공지',
      views: 789,
      likes: 56,
      comments: 23,
      status: 'approved',
      createdAt: '2024-01-13 11:00',
      reported: false,
    },
  ]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryBadge = (category) => {
    const variants = {
      질문: 'default',
      후기: 'secondary',
      공지: 'destructive',
      기타: 'outline',
    };
    return <Badge variant={variants[category]}>{category}</Badge>;
  };

  const getStatusBadge = (status, reported) => {
    if (reported) {
      return (
        <Badge variant="outline" className="border-red-500 text-red-600">
          신고됨
        </Badge>
      );
    }
    return status === 'approved' ? (
      <Badge variant="outline" className="border-green-500 text-green-600">
        승인
      </Badge>
    ) : (
      <Badge variant="outline" className="border-yellow-500 text-yellow-600">
        대기
      </Badge>
    );
  };

  const handleApprove = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, status: 'approved', reported: false } : post
      )
    );
  };

  const handleDelete = (id) => {
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  const stats = {
    total: posts.length,
    approved: posts.filter((p) => p.status === 'approved').length,
    pending: posts.filter((p) => p.status === 'pending').length,
    reported: posts.filter((p) => p.reported).length,
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
          커뮤니티 관리
        </h1>
        <p className="text-muted-foreground">
          커뮤니티 게시글과 댓글을 관리하고 신고를 처리합니다
        </p>
      </motion.div>

      {/* 통계 카드 */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          { label: '전체 게시글', value: stats.total, color: 'from-blue-500 to-blue-600' },
          { label: '승인됨', value: stats.approved, color: 'from-green-500 to-green-600' },
          { label: '대기중', value: stats.pending, color: 'from-yellow-500 to-yellow-600' },
          { label: '신고됨', value: stats.reported, color: 'from-red-500 to-red-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-white/80">
              <CardContent className="pt-6">
                <div className={`mb-2 inline-block rounded-lg bg-gradient-to-br ${stat.color} px-3 py-1 text-white`}>
                  {stat.value}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 검색 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="게시글 제목 또는 작성자 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 게시글 테이블 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle>게시글 목록 ({filteredPosts.length}개)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>작성자</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>조회수</TableHead>
                  <TableHead>좋아요</TableHead>
                  <TableHead>댓글</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow
                    key={post.id}
                    className={post.reported ? 'bg-red-50' : ''}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {post.reported && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <span>{post.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{getCategoryBadge(post.category)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        {post.views}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                        {post.likes}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        {post.comments}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(post.status, post.reported)}</TableCell>
                    <TableCell>{post.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {post.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApprove(post.id)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(post.id)}
                        >
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

export default AdminCommunity;
