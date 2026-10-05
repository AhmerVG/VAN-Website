"""
NORMALISE THE PACK SHOTS — 10 September 2026.

Tahir: "we need to correct the crop star web picture, its so badly placed and design. it doesn look
like a bag like we have shown vital urea of potash. check all the brand icons/bags image and see.
they much update."

He was right, and measuring the 23 images showed exactly why. Nineteen of them share one canvas and
one content box to the pixel — bags at 262x487 inside 560x560, bottles at 182x488 — which is why a
row of them reads as a shelf. Four do not:

  crop-force        356x482 in 560x560 — 36% WIDER than every other bag, so it looms
  v-germinator-pro  no alpha at all — a solid white rectangle that shows on every sand panel
  vl-npk            260x480 canvas — a different shape entirely, so it renders at its own scale
  humi-grow-plus    340x480 canvas — same

Because the site sizes pack shots by HEIGHT (maxHeight), a different canvas ratio means a different
apparent object size on the page. That is the mechanism behind "badly placed": nothing is misplaced
by hand, the canvases disagree.

WHAT THIS DOES: puts all 23 on one 560x560 transparent canvas, scales each object to a common height
of 487px, centres it horizontally and sits it on a common baseline 36px up. That is the rule the
nineteen good ones already follow; this makes it true of all of them.

WHAT THIS CANNOT DO, and Tahir needs to know: Crop Force is not a photograph. It is the flat print
artwork, square-cropped, with no bag form, no fold and no shadow, while Vital Urea and Vital Potash
are photographed packs. Scaling it correctly stops it looming, but it will still read as a label
rather than a bag until VAN supplies a real pack shot of it. Same class of problem, smaller, on
VL-NPK and Humi Grow Plus, whose bottles are cropped in the source file.
"""
import base64, io, json, re, sys
from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'src' / 'data' / 'assets.ts'

CANVAS = 560
TARGET_H = 487   # the height the nineteen good ones already use
BASELINE = 36    # pixels of clear space under the object

src = ASSETS.read_text(encoding='utf-8')
i = src.index('export const PACK_WEBP')
j = src.index('{', i)
d = 0
for k in range(j, len(src)):
    if src[k] == '{': d += 1
    elif src[k] == '}':
        d -= 1
        if d == 0:
            k += 1
            break
packs = json.loads(src[j:k])
head, tail = src[:j], src[k:]

def strip_opaque_background(im):
    """Flood the background in from the four edges only, so white INSIDE a label survives."""
    im = im.convert('RGBA')
    px = im.load()
    W, H = im.size
    seen = set()
    stack = [(x, y) for x in range(W) for y in (0, H - 1)] + [(x, y) for y in range(H) for x in (0, W - 1)]
    def near_white(p):
        return p[0] > 244 and p[1] > 244 and p[2] > 244
    while stack:
        x, y = stack.pop()
        if (x, y) in seen or not (0 <= x < W and 0 <= y < H):
            continue
        seen.add((x, y))
        p = px[x, y]
        if p[3] == 0 or not near_white(p):
            continue
        px[x, y] = (p[0], p[1], p[2], 0)
        stack.extend([(x+1, y), (x-1, y), (x, y+1), (x, y-1)])
    return im

changed = []
for slug, uri in packs.items():
    raw = base64.b64decode(uri.split(',', 1)[1])
    im = Image.open(io.BytesIO(raw)).convert('RGBA')
    before = im.size

    if im.split()[3].getextrema()[0] == 255:      # fully opaque -> it has a baked background
        im = strip_opaque_background(im)

    box = im.split()[3].getbbox()
    if box is None:
        print(f'  !! {slug}: nothing to crop, left alone')
        continue
    obj = im.crop(box)

    scale = TARGET_H / obj.height
    obj = obj.resize((max(1, round(obj.width * scale)), TARGET_H), Image.LANCZOS)

    canvas = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    canvas.alpha_composite(obj, ((CANVAS - obj.width) // 2, CANVAS - BASELINE - TARGET_H))

    buf = io.BytesIO()
    canvas.save(buf, format='WEBP', quality=88, method=6)
    packs[slug] = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
    changed.append((slug, before, obj.size, len(raw), buf.tell()))

body = json.dumps(packs, ensure_ascii=False, separators=(', ', ': '))
ASSETS.write_text(head + body + tail, encoding='utf-8')

print(f'{"product":22} {"was":>10} {"object now":>11} {"KB":>10}')
for slug, before, now, oldb, newb in changed:
    print(f'{slug:22} {before[0]:4}x{before[1]:<4} {now[0]:4}x{now[1]:<4} {oldb//1024:4} -> {newb//1024:<4}')
print(f'\n{len(changed)} pack shots normalised to {CANVAS}x{CANVAS}, object height {TARGET_H}, baseline {BASELINE}')
