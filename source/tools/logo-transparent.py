"""
THE HEADER LOGO'S WHITE BOX — 10 September 2026.

Tahir, 9 Sep: "SAME LOGO IS PLACED ON THE TOP WITHOUT ANY CLEAN PALCEMENT, TOOO BAD."

Measured: the logo asset is RGBA but its alpha channel is 255 everywhere — a solid white background
baked into the file. The site's header is cream (--sand), so the logo has been sitting in a visible
white rectangle on every page. That is the "without any clean placement".

This flood-fills the white in from the four edges only, so white INSIDE the mark survives: the
highlight inside the horse, the counters of the letters, the white of the TM. Nothing is recoloured
and nothing is redrawn — the trademark is untouched, a background is removed.

THE FOOTER IS DELIBERATELY UNAFFECTED and stays exactly as it is, per his ruling last night. The
footer is navy and this logo's wordmark is navy, so it needs either the white plate it already draws
or the reversed white artwork, which VAN has not sent yet. The plate is drawn by the surrounding
div, not by the image, so it keeps working with a transparent logo.
"""
import base64, io, re
from pathlib import Path
from PIL import Image

ASSETS = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'assets.ts'
src = ASSETS.read_text(encoding='utf-8')
m = re.search(r'export const LOGO = "(data:image/png;base64,[^"]+)"', src)
assert m, 'LOGO not found'

im = Image.open(io.BytesIO(base64.b64decode(m.group(1).split(',', 1)[1]))).convert('RGBA')
W, H = im.size
px = im.load()
before = im.split()[3].getextrema()

seen = set()
stack = [(x, y) for x in range(W) for y in (0, H - 1)] + [(x, y) for y in range(H) for x in (0, W - 1)]
while stack:
    x, y = stack.pop()
    if (x, y) in seen or not (0 <= x < W and 0 <= y < H):
        continue
    seen.add((x, y))
    p = px[x, y]
    if p[3] == 0 or not (p[0] > 240 and p[1] > 240 and p[2] > 240):
        continue
    px[x, y] = (p[0], p[1], p[2], 0)
    stack.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

buf = io.BytesIO()
im.save(buf, format='PNG', optimize=True)
uri = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()
ASSETS.write_text(src.replace(m.group(1), uri), encoding='utf-8')

opaque = sum(1 for y in range(H) for x in range(W) if px[x, y][3] > 0)
print(f'logo {W}x{H}: alpha was {before}, now {im.split()[3].getextrema()}')
print(f'{opaque} of {W*H} pixels kept ({100*opaque/(W*H):.0f}% ink), {len(buf.getvalue())//1024} KB')
