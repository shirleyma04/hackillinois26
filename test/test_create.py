import requests

API_URL = "http://127.0.0.1:8000/voices/design/create"

payload = {
    "voice_name": "Corporate Executive",
    "voice_description": "Authoritative corporate executive voice with confident and professional tone.",
    "generated_voice_id": "cW9TKFZZUF6RNR1xt00R"
}

response = requests.post(API_URL, json=payload)

if response.status_code == 200:
    data = response.json()
    print("\nVoice Created!")
    print("Voice ID:", data["voice_id"])
else:
    print("Error:", response.status_code, response.text)