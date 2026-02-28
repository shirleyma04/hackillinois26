import requests

API_URL = "http://127.0.0.1:8000/voices/clone"

payload = {
    "name": "Test Clone Voice",
    "file_paths": [
        "../samples/spongebob30sec.mp3"
    ]
}

'''
payload = {
    "name": "Test Clone Voice",
    "file_paths": [
        "samples/voice1.mp3",
        "samples/voice2.mp3"
    ]
}
'''

response = requests.post(API_URL, json=payload)

if response.status_code == 200:
    data = response.json()
    print("\nVoice cloned successfully!")
    print("Voice ID:", data["voice_id"])
    print("Name:", data["name"])
else:
    print("Error:", response.status_code, response.text)