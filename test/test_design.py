import requests
import base64
from elevenlabs.play import play

API_URL = "http://127.0.0.1:8000/voices/design"

payload = {
    "voice_description": "A bubbly, energetic high school teenager with a Valley Girl accent. Speaks with a sing-songy, casual tone, often elongating vowels and using phrases like 'like' and 'totally.' Friendly, expressive, and slightly dramatic, capturing the enthusiasm and social vibe of a teenage girl chatting with her friends.",
    "text": "Oh my gosh, like, did you see what she was wearing today? Totally cute, but, like, so extra. And, like, I cannot even with the cafeteria food—it's, like, seriously the worst. Anyways, we should totally get our nails done this weekend. I mean, like, duh, it's gonna be so much fun! And, like, we have to take a million selfies. Literally, it's, like, a full-on vibe."
}

response = requests.post(API_URL, json=payload)

if response.status_code == 200:
    data = response.json()

    print("\nGenerated Previews:\n" + "-" * 30)
    for preview in data["previews"]:
        print("Generated Voice ID:", preview["generated_voice_id"])

        audio_base64 = preview["audio_base64"]
        audio_bytes = base64.b64decode(audio_base64)
        play(audio_bytes)

else:
    print("Error:", response.status_code, response.text)