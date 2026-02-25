import os
path = r"c:\Users\dangr\Projectslote-king-eventslotekingeventsestructure_page.py"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

dq = chr(34)
ap = chr(39)
bs = chr(92)
dl = chr(36)
nl = chr(10)

# Build the correct line 124 (index 123) - the main replacement
# Target: bottom = bottom.replace("King's Table — $34.99", "King's Table — $36.99")
line124 = ("bottom = bottom.replace(" + dq + "King" + ap + "s Table "
          + bs + "u2014 " + dl + "34.99" + dq + ", "
          + dq + "King" + ap + "s Table "
          + bs + "u2014 " + dl + "36.99" + dq + ")" + nl)

print("New line 124:", repr(line124))

# Remove line 125 (the broken one with literal em dash) and replace 124
new_lines = lines[:123] + [line124] + lines[125:]

with open(path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Fixed\!")
