# test_music.py

import requests

API_URL = "http://127.0.0.1:8000/music/generate"

payload = {
    "prompt": "Create a high-energy hip-hop track with aggressive trap drums and heavy 808 bass. Include a old grandmother wizard rap vocal delivering sharp, punchy lyrics about confronting an ex who cheated, expressing frustration and empowerment. Fast tempo, catchy rhythm, strong attitude, and a bold, dramatic ending.",
    "duration_ms": 6000
}

response = requests.post(API_URL, json=payload)

if response.status_code == 200:
    data = response.json()
    print("Music file saved at:", data["file_path"])
else:
    print("Error:", response.status_code, response.text)