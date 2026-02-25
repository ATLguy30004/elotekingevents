#!/usr/bin/env python3
"""Restructure Elote King Events index.astro"""
import os
import re

FILE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "pages", "index.astro")

with open(FILE_PATH, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")

# Find boundaries
body_start = None
for i, line in enumerate(lines):
    if "<body>" in line:
        body_start = i
        break

script_start = None
for i, line in enumerate(lines):
    if "<script is:inline>" in line:
        script_start = i
        break

head_section = "\n".join(lines[:body_start])
body_tag = lines[body_start]
scripts_section = "\n".join(lines[script_start:])
body_lines = lines[body_start + 1 : script_start]

def find_line_index(lines_list, marker, start_from=0):
    for i in range(start_from, len(lines_list)):
        if marker in lines_list[i]:
            return i
    return None

markers_to_find = [
    ("URGENCY", "<!-- URGENCY COUNTDOWN BAR -->"),
    ("BADGE", "<!-- BADGE BAR -->"),
    ("LOGO", "<!-- LOGO BAR -->"),
    ("HERO", "<!-- HERO -->"),
    ("SPOTS", "<!-- SPOTS LEFT COUNTER -->"),
    ("PROOF", "<!-- SOCIAL PROOF -->"),
    ("VIDEO", "<!-- VIDEO SECTION -->"),
    ("TASTING", "<!-- PRE-EVENT TASTING REVIEWS -->"),
    ("BRIDGE", "<!-- BRIDGE CTA -->"),
    ("TESTIMONIALS", "<!-- TESTIMONIALS -->"),
    ("MENU", "<!-- MENU -->"),
    ("GUARANTEE", "<!-- GUARANTEE BAR -->"),
    ("DREAM", "<!-- DREAM OUTCOME -->"),
    ("FLIGHTS", "<!-- ===="),
    ("TIMELINE", "<!-- TIMELINE -->"),
    ("BOTTOM", "<!-- BOTTOM CTA + FAQ -->"),
    ("MAP", "<!-- MAP -->"),
    ("TRUST", "<!-- TRUST BAR -->"),
    ("FOOTER", "<!-- FOOTER -->"),
    ("STICKY_WHATSAPP", "<!-- STICKY BAR -->"),
]

skip_link_end = find_line_index(body_lines, "<!-- URGENCY COUNTDOWN BAR -->")
section_ranges = {}
section_ranges["SKIP_LINK"] = (0, skip_link_end)

positions = []
search_from = 0
for name, marker in markers_to_find:
    idx = find_line_index(body_lines, marker, search_from)
    if idx is not None:
        positions.append((name, idx))
        search_from = idx + 1
    else:
        print(f"WARNING: Could not find marker for {name}: {marker}")

for i, (name, start) in enumerate(positions):
    if i + 1 < len(positions):
        end = positions[i + 1][1]
    else:
        end = len(body_lines)
    section_ranges[name] = (start, end)

sections = {}
for name, (start, end) in section_ranges.items():
    sections[name] = "\n".join(body_lines[start:end])

print("=== Sections found ===")
all_names = ["SKIP_LINK", "URGENCY", "BADGE", "LOGO", "HERO", "SPOTS", "PROOF",
             "VIDEO", "TASTING", "BRIDGE", "TESTIMONIALS", "MENU", "GUARANTEE",
             "DREAM", "FLIGHTS", "TIMELINE", "BOTTOM", "MAP", "TRUST", "FOOTER",
             "STICKY_WHATSAPP"]
for name in all_names:
    if name in sections:
        preview = sections[name][:80].replace("\n", " | ")
        print(f"  {name}: {len(sections[name])} chars - {preview}...")
    else:
        print(f"  {name}: MISSING!")

# === EDIT 1 : HERO ===
hero = sections["HERO"]
hero = hero.replace('src="/images/hero_line_cropped.jpg"', 'src="/images/hero-trailer-daytime.jpeg"')
hero = hero.replace('alt="Event #1 crowd lined up at Elote King food truck in Alpharetta"', 'alt="Elote King halal Mexican street food trailer in Alpharetta, Georgia"')
hero_cta = '      <a href="#flights" class="btn-claim pulse" style="display:inline-block; margin-top:16px; max-width:340px;">Claim Your Spot \u2014 Starting at $14.99 \u2192</a>'
marker_str = 'class="hero-sub"'
idx_sub = hero.find(marker_str)
if idx_sub >= 0:
    end_p = hero.find("</p>", idx_sub)
    if end_p >= 0:
        insert_pos = end_p + 4
        hero = hero[:insert_pos] + "\n" + hero_cta + hero[insert_pos:]
        print("  [INFO] Inserted hero CTA after hero-sub")
sections["HERO"] = hero

# === EDIT 2: SPOTS ===
spots = sections["SPOTS"]
spots = spots.replace('href="#menu"', 'href="#flights"')
sections["SPOTS"] = spots

# === EDIT 3: FLIGHTS ===
flights = sections["FLIGHTS"]
flights = flights.replace("Secret menu item", "Our signature corn cup \u2014 topped with our house-made crema, chili lime, and cotija cheese")
sections["FLIGHTS"] = flights

# === EDIT 4: BOTTOM (SMS form price) ===
bottom = sections["BOTTOM"]
bottom = bottom.replace("King's Table \u2014 $34.99", "King's Table \u2014 $36.99")
bottom = bottom.replace("King&#39;s Table &mdash; $34.99", "King&#39;s Table &mdash; $36.99")
bottom = bottom.replace("King's Table &mdash; $34.99", "King's Table &mdash; $36.99")
bottom = bottom.replace("King's Table -- $34.99", "King's Table -- $36.99")
sections["BOTTOM"] = bottom

# === EDIT 5: STICKY BAR ===
sticky = sections["STICKY_WHATSAPP"]
sticky = sticky.replace('href="#menu"', 'href="#flights"')
sections["STICKY_WHATSAPP"] = sticky
# === REASSEMBLE IN NEW ORDER ===
# REMOVED: BRIDGE, DREAM
new_order = [
    "SKIP_LINK", "URGENCY", "BADGE", "LOGO", "HERO", "SPOTS", "PROOF",
    "MENU", "GUARANTEE", "TIMELINE", "FLIGHTS",
    "VIDEO", "TASTING", "TESTIMONIALS",
    "BOTTOM", "MAP", "TRUST", "FOOTER", "STICKY_WHATSAPP",
]

new_body_parts = []
for name in new_order:
    new_body_parts.append(sections[name])

new_body = "\n".join(new_body_parts)
full_file = head_section + "\n" + body_tag + "\n" + new_body + "\n" + scripts_section

with open(FILE_PATH, "w", encoding="utf-8") as f:
    f.write(full_file)

print()
print("=== File rewritten successfully ===")
print(f"Total length: {len(full_file)} characters")

if "BRIDGE" not in new_order:
    print("  [OK] Bridge CTA section REMOVED")
if "DREAM" not in new_order:
    print("  [OK] Dream Outcome section REMOVED")
if "hero-trailer-daytime.jpeg" in sections["HERO"]:
    print("  [OK] Hero image src updated")
if "Claim Your Spot" in sections["HERO"]:
    print("  [OK] Hero CTA button added")
if 'href="#flights"' in sections["SPOTS"]:
    print("  [OK] Spots counter link updated to #flights")
if "Our signature corn cup" in sections["FLIGHTS"]:
    count_e = sections["FLIGHTS"].count("Our signature corn cup")
    print(f"  [OK] Esquite description updated ({count_e} instances)")
if "$36.99" in sections["BOTTOM"]:
    print("  [OK] SMS form price updated to $36.99")
else:
    print("  [WARN] SMS form price edit may not have matched")
    matches = re.findall(r"King.{0,10}Table.{0,20}34.99", sections["BOTTOM"])
    for m in matches:
        print(f"    Found unmatched: {repr(m)}")
if 'href="#flights"' in sections["STICKY_WHATSAPP"]:
    print("  [OK] Sticky bar link updated to #flights")
