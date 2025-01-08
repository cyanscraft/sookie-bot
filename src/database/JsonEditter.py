import json

# JSON 파일 읽기
with open('characters.json', 'r', encoding='utf-8') as file:
    data = json.load(file)  # JSON 데이터를 로드

# JSON 데이터 출력 확인
print("원본 데이터:", data)

# 특정 키만 남기기
keys_to_keep = ["firstName", "description", "genderType", "rank", "effectDescription"]  # 유지할 키
filtered_data = [
    {key: item[key] for key in keys_to_keep if key in item} 
    for item in data.get("characters", [])  # "characters" 배열을 안전하게 순회
]

# 필터링된 데이터 출력 확인
print("필터링된 데이터:", filtered_data)

# 결과를 JSON 파일로 저장하기
with open('filtered_data.json', 'w', encoding='utf-8') as file:
    json.dump({"characters": filtered_data}, file, ensure_ascii=False, indent=4)

print("필터링된 데이터가 저장되었습니다.")