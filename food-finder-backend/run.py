from src import create_app, db

# 애플리케이션 팩토리 함수를 호출하여 app 인스턴스를 생성합니다.
app = create_app()

if __name__ == '__main__':
    # app 컨텍스트 안에서 데이터베이스 테이블을 생성합니다.
    with app.app_context():
        # DB에 테이블이 아직 없으면 모두 생성해줍니다.
        db.create_all() 
    
    # 서버를 실행합니다.
    # 개발 중에는 디버그 모드를 True로 두면 편리합니다.
    app.run(host='0.0.0.0', port=5000, debug=True) 