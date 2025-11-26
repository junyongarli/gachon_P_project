import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MessageSquare, ThumbsUp, User, Calendar, Utensils, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';

function ReviewPage() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      restaurantName: '맛있는 한식당',
      userName: '김철수',
      rating: 5,
      content: '정말 맛있었어요! 특히 김치찌개가 일품이었습니다. 재방문 의사 100%',
      date: '2024-01-15',
      likes: 12,
      category: '한식',
    },
    {
      id: 2,
      restaurantName: '이탈리안 레스토랑',
      userName: '이영희',
      rating: 4,
      content: '파스타가 정말 맛있었어요. 분위기도 좋고 데이트하기 좋은 곳입니다.',
      date: '2024-01-14',
      likes: 8,
      category: '양식',
    },
  ]);

  const [newReview, setNewReview] = useState({
    restaurantName: '',
    rating: 5,
    content: '',
  });

  const { user } = useAuth();

  // 리뷰 작성
  const handleSubmitReview = () => {
    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    if (!newReview.restaurantName.trim() || !newReview.content.trim()) {
      alert('맛집 이름과 리뷰 내용을 입력해주세요.');
      return;
    }

    const review = {
      id: Date.now(),
      ...newReview,
      userName: user.username,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      category: '기타',
    };

    setReviews([review, ...reviews]);
    setNewReview({ restaurantName: '', rating: 5, content: '' });
    alert('리뷰가 작성되었습니다!');
  };

  // 좋아요
  const handleLike = (reviewId) => {
    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, likes: review.likes + 1 }
        : review
    ));
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
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                맛집 리뷰
              </h1>
              <p className="text-gray-600 mt-1">다른 사람들의 리뷰를 확인하고 나의 경험을 공유하세요</p>
            </div>
          </div>
        </motion.div>

        {/* 탭 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 mb-6">
              <TabsTrigger value="list">리뷰 목록</TabsTrigger>
              <TabsTrigger value="write">리뷰 작성</TabsTrigger>
            </TabsList>

            {/* 리뷰 목록 탭 */}
            <TabsContent value="list">
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl text-gray-800">
                                  {review.restaurantName}
                                </h3>
                                <Badge className="bg-orange-100 text-orange-700 border-none">
                                  {review.category}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>{review.userName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{review.date}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-5 h-5 ${
                                      star <= review.rating
                                        ? 'text-yellow-500 fill-yellow-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>

                              <p className="text-gray-700 leading-relaxed mb-4">
                                {review.content}
                              </p>

                              <Button
                                onClick={() => handleLike(review.id)}
                                variant="ghost"
                                size="sm"
                                className="hover:bg-orange-50 hover:text-orange-600"
                              >
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                도움됐어요 ({review.likes})
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-xl text-gray-600 mb-2">아직 리뷰가 없습니다</p>
                      <p className="text-gray-500">첫 번째 리뷰를 작성해보세요!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* 리뷰 작성 탭 */}
            <TabsContent value="write">
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                <CardContent className="p-6">
                  {user ? (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Utensils className="w-5 h-5 text-orange-500" />
                          <label className="text-sm text-gray-700">맛집 이름</label>
                        </div>
                        <Input
                          type="text"
                          placeholder="방문한 맛집의 이름을 입력하세요"
                          value={newReview.restaurantName}
                          onChange={(e) => setNewReview({ ...newReview, restaurantName: e.target.value })}
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="w-5 h-5 text-orange-500" />
                          <label className="text-sm text-gray-700">평점</label>
                        </div>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  star <= newReview.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Edit3 className="w-5 h-5 text-orange-500" />
                          <label className="text-sm text-gray-700">리뷰 내용</label>
                        </div>
                        <Textarea
                          placeholder="맛집에 대한 솔직한 리뷰를 작성해주세요&#10;- 음식의 맛은 어땠나요?&#10;- 서비스는 만족스러웠나요?&#10;- 분위기는 어땠나요?&#10;- 다시 방문하고 싶으신가요?"
                          value={newReview.content}
                          onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                          rows={8}
                          className="resize-none"
                        />
                      </div>

                      <Button
                        onClick={handleSubmitReview}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        리뷰 작성하기
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-xl text-gray-600 mb-4">로그인이 필요한 서비스입니다</p>
                      <p className="text-gray-500 mb-6">리뷰를 작성하려면 로그인해주세요</p>
                      <a href="/login">
                        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                          로그인하러 가기
                        </Button>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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

export default ReviewPage;
