import requests

API_URL = "http://127.0.0.1:8000/voices/design/create"

payload = {
    "voice_name": "High School Voice",
    "voice_description": "Bubbly Valley Girl teen with a sing-songy, playful tone.",
    "generated_voice_id": "SaxQmcnUVUYw2AfMaRkL"
}

response = requests.post(API_URL, json=payload)

if response.status_code == 200:
    data = response.json()
    print("\nVoice Created!")
    print("Voice ID:", data["voice_id"])
else:
    print("Error:", response.status_code, response.text)