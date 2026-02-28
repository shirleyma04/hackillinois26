import requests

API_URL = "http://127.0.0.1:8000/voices/search"

payload = {
    "gender": "female",
    "language": "en",
    "page_size": 10,
    "page": 0
}

response = requests.post(API_URL, json=payload)

if response.status_code == 200:
    data = response.json()

    print("\nVoices Found:\n" + "-" * 30)
    for voice in data["voices"]:
        print(f"ID: {voice['voice_id']} | Name: {voice['name']}")

    print("\nHas More:", data["has_more"])

else:
    print("Error:", response.status_code, response.text)