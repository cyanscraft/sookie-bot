import json
import sqlite3

# JSON 파일 읽기
with open("university.json", "r") as file:
    data = json.load(file)

# SQLite 데이터베이스 연결
conn = sqlite3.connect("game_data.db")
cursor = conn.cursor()

# 테이블 생성
cursor.execute("""
    CREATE TABLE IF NOT EXISTS university (
        id INTEGER PRIMARY KEY,
        name TEXT,
        effect TEXT,
        isPng BOOLEAN
    )
""")

# 데이터 삽입
for character in data["badges"]:
    cursor.execute("""
    INSERT INTO university (id, name, effect,isPng)
    VALUES (?, ?, ?,?)
    """, (character.get("universityId"), character.get("name"), json.dumps(character.get("effect", {})),character.get("isPng")))

# 변경사항 저장 및 연결 닫기
conn.commit()
conn.close()

print("JSON 데이터가 SQLite로 성공적으로 변환되었습니다!")