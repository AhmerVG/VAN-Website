"""Put the new Crop Force pack shot into the site, through the same normaliser as the other 22."""
import base64, io, json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'src' / 'data' / 'assets.ts'
CANVAS, TARGET_H, BASELINE = 560, 487, 36

im = Image.open(ROOT / 'tools' / 'cropforce-packshot.png').convert('RGBA')
obj = im.crop(im.split()[3].getbbox())
obj = obj.resize((max(1, round(obj.width * TARGET_H / obj.height)), TARGET_H), Image.LANCZOS)
canvas = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
canvas.alpha_composite(obj, ((CANVAS - obj.width) // 2, CANVAS - BASELINE - TARGET_H))

buf = io.BytesIO()
canvas.save(buf, format='WEBP', quality=90, method=6)

src = ASSETS.read_text(encoding='utf-8')
i = src.index('export const PACK_WEBP'); j = src.index('{', i)
d = 0
for k in range(j, len(src)):
    if src[k] == '{': d += 1
    elif src[k] == '}':
        d -= 1
        if d == 0:
            k += 1
            break
packs = json.loads(src[j:k])
packs['crop-force'] = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
ASSETS.write_text(src[:j] + json.dumps(packs, ensure_ascii=False, separators=(', ', ': ')) + src[k:], encoding='utf-8')
print(f'crop-force replaced: object {obj.width}x{obj.height} on {CANVAS}x{CANVAS}, {buf.tell()//1024} KB')
