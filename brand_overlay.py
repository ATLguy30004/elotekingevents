from PIL import Image, ImageDraw, ImageFilter, ImageFont
import numpy as np

W, H = 1024, 1024

img = Image.open("public/images/chorizo-gemini-v1.jpg").convert("RGBA")

# --- BOTTOM GRADIENT: dark band for text legibility ---
# Starts at y=680, fully opaque black by y=1024
gradient = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(gradient)
grad_start = 680
for y in range(H):
    if y >= grad_start:
        t = (y - grad_start) / (H - grad_start)
        alpha = int(235 * (t ** 1.3))
        gd.line([(0, y), (W, y)], fill=(0, 0, 0, alpha))

img = Image.alpha_composite(img, gradient)
draw = ImageDraw.Draw(img)

# --- FONTS ---
font_name  = ImageFont.truetype("C:/Windows/Fonts/impact.ttf", 80)   # Dish name
font_sub   = ImageFont.truetype("C:/Windows/Fonts/impact.ttf", 40)   # Tagline
font_badge = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 19)  # Badge
font_brand = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22)  # ELOTE KING

# --- MEASURE TEXT so nothing overlaps ---
def text_h(text, font):
    bb = draw.textbbox((0, 0), text, font=font)
    return bb[3] - bb[1]

def text_w(text, font):
    bb = draw.textbbox((0, 0), text, font=font)
    return bb[2] - bb[0]

line1 = "BEEF CHORIZO"
line2 = "DRIP FRIES"
tagline = "You will not stop eating this."

h1 = text_h(line1, font_name)    # ~70px
h2 = text_h(line2, font_name)    # ~70px
ht = text_h(tagline, font_sub)   # ~34px

pad = 28          # left padding
gap = 12          # gap between lines
bottom_pad = 22   # gap from bottom edge

# Stack from bottom up
y_tag   = H - bottom_pad - ht
y_line2 = y_tag - gap - h2
y_line1 = y_line2 - gap - h1

# --- DISH NAME (2 lines, white with subtle shadow) ---
for line, y in [(line1, y_line1), (line2, y_line2)]:
    # drop shadow
    draw.text((pad + 3, y + 3), line, font=font_name, fill=(0, 0, 0, 160))
    draw.text((pad, y), line, font=font_name, fill="white")

# --- TAGLINE (green) ---
draw.text((pad + 2, y_tag + 2), tagline, font=font_sub, fill=(0, 0, 0, 130))
draw.text((pad, y_tag), tagline, font=font_sub, fill="#22c55e")

# --- ELOTE KING (bottom right, aligned with tagline baseline) ---
ek_text = "ELOTE KING"
ek_w = text_w(ek_text, font_brand)
ek_h = text_h(ek_text, font_brand)
ek_x = W - ek_w - 20
ek_y = H - bottom_pad - ek_h
draw.text((ek_x, ek_y), ek_text, font=font_brand, fill=(255, 255, 255, 210))

# --- HALAL BADGE (top right) ---
badge_text = "100% ZABIHA HALAL"
bw = text_w(badge_text, font_badge)
bh = text_h(badge_text, font_badge)
pad_x, pad_y = 14, 8
bx = W - bw - pad_x*2 - 16
by = 16
draw.rounded_rectangle(
    [bx, by, bx + bw + pad_x*2, by + bh + pad_y*2],
    radius=7, fill="#16a34a"
)
draw.text((bx + pad_x, by + pad_y), badge_text, font=font_badge, fill="white")

# --- SAVE ---
out = img.convert("RGB")
out.save("public/images/chorizo-drip-fries-final.jpg", quality=95)
print("Saved: chorizo-drip-fries-final.jpg")
