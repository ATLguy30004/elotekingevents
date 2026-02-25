from PIL import Image, ImageEnhance, ImageDraw, ImageFilter, ImageFont
import numpy as np

# Load best raw photo (Photo 2 — cleanest, marble counter, good angle)
img = Image.open("public/images/Chorizo 2 raw.jpeg").convert("RGB")
w, h = img.size

# --- CROP: square centered on food ---
# Food is centered in the frame, crop to square
size = min(w, h)
left = (w - size) // 2
top = (h - size) // 2 - int(h * 0.04)  # shift up slightly to get more food
top = max(0, top)
img = img.crop((left, top, left + size, top + size))
img = img.resize((900, 900), Image.LANCZOS)

# --- CINEMATIC COLOR GRADE ---
# 1. Boost contrast (cinematic punch)
img = ImageEnhance.Contrast(img).enhance(1.45)

# 2. Boost color saturation (make food pop — cheese, meat, pico)
img = ImageEnhance.Color(img).enhance(1.55)

# 3. Slight brightness lift
img = ImageEnhance.Brightness(img).enhance(1.08)

# 4. Sharpness
img = ImageEnhance.Sharpness(img).enhance(1.3)

# --- WARM TONE OVERLAY (cinematic golden cast) ---
arr = np.array(img).astype(np.float32)
# Add warm cast: boost red slightly, reduce blue slightly
arr[:, :, 0] = np.clip(arr[:, :, 0] * 1.06, 0, 255)  # red up
arr[:, :, 2] = np.clip(arr[:, :, 2] * 0.90, 0, 255)  # blue down
img = Image.fromarray(arr.astype(np.uint8))

# --- VIGNETTE (dark edges for cinematic depth) ---
vignette = Image.new("L", (900, 900), 0)
vd = ImageDraw.Draw(vignette)
for i in range(180):
    alpha = int(180 * (1 - i / 180) ** 1.8)
    vd.rectangle([i, i, 900 - i, 900 - i], outline=alpha)
# Gaussian blur to smooth vignette
vignette = vignette.filter(ImageFilter.GaussianBlur(radius=60))
# Apply vignette as dark overlay
dark_layer = Image.new("RGB", (900, 900), (0, 0, 0))
img = Image.composite(dark_layer, img, vignette)

# --- DARK GRADIENT at bottom for text legibility ---
gradient = Image.new("RGBA", (900, 900), (0, 0, 0, 0))
gd = ImageDraw.Draw(gradient)
for y in range(900):
    if y > 580:
        alpha = min(220, int(220 * ((y - 580) / 320) ** 1.5))
        gd.line([(0, y), (900, y)], fill=(0, 0, 0, alpha))
img = img.convert("RGBA")
img = Image.alpha_composite(img, gradient)

# --- TEXT OVERLAYS ---
draw = ImageDraw.Draw(img)

# Fonts
try:
    font_big = ImageFont.truetype("C:/Windows/Fonts/impact.ttf", 72)
    font_med = ImageFont.truetype("C:/Windows/Fonts/impact.ttf", 36)
    font_small = ImageFont.truetype("C:/Windows/Fonts/impact.ttf", 28)
    font_tag = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 18)
    font_brand = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22)
except:
    font_big = ImageFont.load_default()
    font_med = font_big
    font_small = font_big
    font_tag = font_big
    font_brand = font_big

# --- TOP RIGHT: HALAL BADGE ---
badge_text = "100% ZABIHA HALAL"
bbox = draw.textbbox((0, 0), badge_text, font=font_tag)
bw = bbox[2] - bbox[0] + 24
bh = bbox[3] - bbox[1] + 14
bx = 900 - bw - 18
by = 18
draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=6, fill="#16a34a")
draw.text((bx + 12, by + 7), badge_text, font=font_tag, fill="white")

# --- BOTTOM LEFT: Dish Name ---
name_x = 22
name_y = 740
draw.text((name_x + 2, name_y + 2), "BEEF CHORIZO", font=font_big, fill=(0, 0, 0, 120))
draw.text((name_x, name_y), "BEEF CHORIZO", font=font_big, fill="white")

name_y2 = name_y + 72
draw.text((name_x + 2, name_y2 + 2), "DRIP FRIES", font=font_big, fill=(0, 0, 0, 120))
draw.text((name_x, name_y2), "DRIP FRIES", font=font_big, fill="white")

# Tagline in green
draw.text((name_x, name_y2 + 74), "Loaded. No regrets.", font=font_med, fill="#16a34a")

# --- BOTTOM RIGHT: ELOTE KING brand ---
brand_text = "ELOTE KING"
bbox2 = draw.textbbox((0, 0), brand_text, font=font_brand)
bw2 = bbox2[2] - bbox2[0]
draw.text((900 - bw2 - 18, 862), brand_text, font=font_brand, fill=(255, 255, 255, 200))

# --- SAVE ---
out = img.convert("RGB")
out.save("public/images/chorizo-drip-fries-branded-final.jpg", quality=93, optimize=True)
print("Saved: chorizo-drip-fries-branded-final.jpg")
