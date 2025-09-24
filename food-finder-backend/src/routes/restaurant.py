import requests
import os
from flask import Blueprint, request, jsonify

restaurant_bp = Blueprint('restaurant', __name__)
    
# 음식 취향 키워드 매핑
FOOD_KEYWORDS = {
    'spicy': ['매운', '떡볶이', '김치찌개', '마라탕', '불닭'], 'mild': ['순한', '된장찌개', '미역국', '백반', '정식'],
    'korean': ['한식', '김치', '불고기', '갈비', '비빔밥'], 'western': ['양식', '파스타', '피자', '스테이크', '햄버거'],
    'rice': ['밥', '덮밥', '볶음밥', '비빔밥', '정식'], 'noodle': ['면', '라면', '냉면', '파스타', '우동'],
    'meat': ['고기', '삼겹살', '갈비', '치킨', '스테이크'], 'seafood': ['해산물', '회', '조개', '새우', '게'],
    'hot': ['뜨거운', '찌개', '국물', '탕', '전골'], 'cold': ['차가운', '냉면', '회', '샐러드', '아이스크림'],
    'salty': ['짠', '젓갈', '김치', '라면', '치킨'], 'sweet': ['단', '디저트', '케이크', '아이스크림', '과일'],
    'traditional': ['전통', '한정식', '백반', '정통', '옛날'], 'modern': ['모던', '퓨전', '신메뉴', '트렌드', '새로운'],
    'alone': ['혼밥', '1인분', '간단한', '가벼운', '테이크아웃'], 'group': ['단체', '회식', '모임', '가족', '여럿이']
}

def perform_kakao_search(params, api_key):
    """카카오 API 검색을 수행하고 결과를 반환하는 헬퍼 함수"""
    url = 'https://dapi.kakao.com/v2/local/search/keyword.json'
    headers = {'Authorization': f'KakaoAK {api_key}'}
    print(f"🔍 카카오 API 요청: {params}") # 디버깅을 위해 요청 파라미터 출력
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()

@restaurant_bp.route('/search', methods=['POST'])
def search_restaurants():
    """사용자 답변 기반으로 맛집 검색. 결과 없으면 키워드를 줄여 재검색합니다."""
    try:
        kakao_api_key = os.environ.get('KAKAO_REST_API_KEY')
        if not kakao_api_key:
            return jsonify({'success': False, 'message': '서버에 API 키가 설정되지 않았습니다.'}), 500
        
        data = request.get_json(force=True)
        answers = data.get('answers', [])
        location = data.get('location', {})
        
        # 1. 키워드 생성
        keywords = [kw for answer in answers if answer in FOOD_KEYWORDS for kw in FOOD_KEYWORDS[answer]]
        unique_keywords = list(set(keywords))
        
        params = {'size': 10, 'category_group_code': 'FD6'}
        if location.get('latitude') and location.get('longitude'):
            params.update({
                'x': str(location['longitude']),
                'y': str(location['latitude']),
                'radius': 2000, # 검색 반경 2km
                'sort': 'distance'
            })
        
        # 2. 1단계 검색: 구체적인 키워드 (최대 2개)로 검색
        params['query'] = ' '.join(unique_keywords[:2]) if unique_keywords else '맛집'
        result = perform_kakao_search(params, kakao_api_key)
        
        # 3. 2단계 검색: 1단계 결과가 없으면, 가장 핵심적인 키워드 1개로 재검색
        if not result.get('documents') and len(unique_keywords) > 1:
            params['query'] = unique_keywords[0]
            result = perform_kakao_search(params, kakao_api_key)

        # 4. 최종 결과 포맷팅
        restaurants = [
            {
                'id': item.get('id'), 'name': item.get('place_name'),
                'category': item.get('category_name'), 'address': item.get('address_name'),
                'phone': item.get('phone'),
                'distance': f"{item.get('distance')}m" if item.get('distance') else '알 수 없음',
                'url': item.get('place_url'),
                'x': item.get('x'), 'y': item.get('y'),
            }
            for item in result.get('documents', [])
        ]
        
        return jsonify({'success': True, 'restaurants': restaurants})
            
    except requests.exceptions.HTTPError as err:
        error_message = err.response.json().get("message", "알 수 없는 API 오류")
        return jsonify({'success': False, 'message': f'API 호출 실패: {error_message}'}), err.response.status_code
    except Exception as e:
        return jsonify({'success': False, 'message': f'서버 오류: {str(e)}'}), 500
# 상태 확인용 API (변경 없음)
@restaurant_bp.route('/health', methods=['GET'])
def health_check():
    """API 상태 확인"""
    return jsonify({'status': 'healthy', 'message': '맛집 검색 API가 정상 작동 중입니다.'})