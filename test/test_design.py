import requests
import base64
from elevenlabs.play import play

API_URL = "http://127.0.0.1:8000/voices/design"

payload = {
    "voice_description": "A confident, authoritative, and professional voice with a calm and commanding tone, like a CEO or corporate executive addressing employees or stakeholders. Speaks clearly, with moderate pacing and a polished, persuasive style.",
    "text": "Good morning team. As we move into the next quarter, our focus will be on innovation, efficiency, and delivering results that exceed expectations. Let's stay committed and lead by example."
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