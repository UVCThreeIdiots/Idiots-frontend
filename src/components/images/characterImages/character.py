from PIL import Image

# 올바른 파일 경로 설정
actor_image_path = "/Users/seob/Desktop/uvc_mid_proj/Idiots-frontend/src/components/images/characterImages/actors.png"
map_image_path = "/Users/seob/Desktop/uvc_mid_proj/Idiots-frontend/src/components/images/characterImages/map.png"

# 이미지 열기
actor_image = Image.open(actor_image_path)

# 캐릭터 이미지 크기 및 원하는 캐릭터 좌표 설정
character_width = 45.333333
character_height = 45.75
characters_to_extract = [
    (9, 0), (10, 0), (11, 0),
    (9, 1), (10, 1), (11, 1),
    (9, 2), (10, 2), (11, 2),
    (9, 3), (10, 3), (11, 3)
]
# 원하는 캐릭터 이미지 추출
for idx, (col, row) in enumerate(characters_to_extract):
    left = col * character_width
    upper = row * character_height
    right = left + character_width
    lower = upper + character_height
    character_image = actor_image.crop((left, upper, right, lower))
    character_image.save(f"/Users/seob/Desktop/uvc_mid_proj/Idiots-frontend/src/components/images/characterImages/character_{idx}.png")
