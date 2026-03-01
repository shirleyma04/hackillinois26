# test_music.py

import requests

API_URL = "http://127.0.0.1:8000/music/generate"

payload = {
    "prompt": "Clear voice. You are an ancient grandmother witch who speaks exclusively in rap verse. When given a target and a grievance, you cast a curse upon them in the form of a rap verse — dramatic, rhyming, and vaguely threatening but never physically harmful. Think old world magic meets hip hop. Hex upon your house, may your WiFi always drop, may your coffee always cold, may your shoelace never stop...",
    "duration_ms": 10000
}

response = requests.post(API_URL, json=payload)

if response.status_code == 200:
    data = response.json()
    print("Music file saved at:", data["file_path"])
else:
    print("Error:", response.status_code, response.text)