import sqlite3

# 유니코드 변환 함수
def unicode_to_text(unicode_str):
    return bytes(unicode_str, "utf-8").decode("unicode_escape")

# SQLite 연결
conn = sqlite3.connect("game_data.db")  # 데이터베이스 파일명
cursor = conn.cursor()

# 테이블의 모든 데이터를 가져오기
cursor.execute("SELECT id, answer FROM problems")
rows = cursor.fetchall()

# 데이터를 변환하고 업데이트
for row in rows:
    record_id = row[0]  # id 값
    unicode_str = row[1]  # 유니코드 문자열
    if unicode_str:  # 유니코드 문자열이 있을 경우만 변환
        decoded_text = unicode_to_text(unicode_str)  # 유니코드 문자열을 한글로 변환
        cursor.execute("UPDATE problems SET answer = ? WHERE id = ?", (decoded_text, record_id))

# 변경 사항 저장
conn.commit()

# 연결 종료
conn.close()

print("유니코드 변환 완료!")
