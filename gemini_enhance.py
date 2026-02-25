import os
import base64
from google import genai
from google.genai import types
from PIL import Image
import io

# Load key from global .env
env_path = os.path.expanduser("~/.env")
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if line.startswith("GEMINI_API_KEY="):
            os.environ["GEMINI_API_KEY"] = line.split("=", 1)[1]

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# Load Photo 2 — best raw shot
with open("public/images/Chorizo 2 raw.jpeg", "rb") as f:
    image_bytes = f.read()

prompt = """
You are a professional food photographer and retoucher.

I'm giving you a real photo of Beef Chorizo Drip Fries — loaded street food fries in a paper boat
with Mexican-seasoned ground beef chorizo, melted cheese, pico de gallo, sour cream drizzle, and hot sauce.

Transform this into a cinematic, production-ready food photography image that makes people
immediately crave and want to order it. Requirements:

- Keep it looking like REAL food (not AI-generated or illustrated)
- Dramatic, moody dark background — replace the white marble counter with a dark slate or black surface
- Professional restaurant-quality lighting: warm key light from the upper-left hitting the food
- Make the cheese look melted and glistening
- Make the sour cream drizzle look fresh and glossy
- Make the pico de gallo look vibrant and fresh (bright greens and reds)
- Deep, rich color grade — warm golden/amber tones on the food
- Slight steam or heat haze effect above the food
- Sharp focus on the food, slightly blurred background
- Remove any background distractions (people, boxes, clutter)
- Square crop, food centered and filling most of the frame
- Output: photorealistic, appetizing, crave-worthy — looks like it belongs in a premium food magazine
"""

response = client.models.generate_content(
    model="gemini-2.0-flash-exp-image-generation",
    contents=[
        types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
        prompt
    ],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"]
    )
)

# Extract and save image
for part in response.candidates[0].content.parts:
    if part.inline_data and part.inline_data.mime_type.startswith("image"):
        img_data = part.inline_data.data
        img = Image.open(io.BytesIO(img_data))
        img.save("public/images/chorizo-gemini-v1.jpg", quality=95)
        print(f"Saved: chorizo-gemini-v1.jpg ({img.size})")
        break
    elif hasattr(part, 'text') and part.text:
        print("Text response:", part.text[:200])
