import requests

API_URL = "http://127.0.0.1:8000/tts/"

payload = {
    "text": [
        "The advent of technology has transformed countless sectors, with education standing out as one of the most significantly impacted fields.",
        "In recent years, educational technology, or EdTech, has revolutionized the way teachers deliver instruction and students absorb information.",
        "From interactive whiteboards to individual tablets loaded with educational software, technology has opened up new avenues for learning that were previously unimaginable."
    ],
    "voice_id": "JBFqnCBsd6RMkjVDRZzb",
    "model_id": "eleven_multilingual_v2",      # optional, can override default
    "output_format": "mp3_44100_128"          # optional, can override default
}

response = requests.post(API_URL, json=payload)

if response.status_code == 200:
    data = response.json()
    print("Audio file saved at:", data["file_path"])
else:
    print("Error:", response.status_code, response.text)