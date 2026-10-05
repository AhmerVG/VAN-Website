"""
BUILD A PACK SHOT FOR CROP FORCE — 10 September 2026.

Tahir: "Does VAN have a real pack shot of the Crop Force bag? No, you should create it yourself.
here is the [brand] folder."

WHAT THIS DOES, AND WHY IT IS NOT A DRAWING.

Every other VAN pack on the site is a photographed bag: it has a top seal, a side gusset, folds, a
highlight down the face and a contact shadow. Crop Force had none of that, because the only image
that existed was the flat print artwork. That is why it looked like a label sitting among bags.

Rather than illustrate a bag, this borrows a REAL one. V-Ammonium Phosphate is VAN's own 10 kg bag,
photographed for the same range, in the same studio light, at the same size as Crop Force. So:

  1. Its ALPHA gives the true silhouette of a VAN 10 kg pack, seal ears and taper included.
  2. Its LIGHT is recovered from the parts of that photograph that are unprinted white. For every
     row of the bag, the low-saturation pixels are sampled and their brightness is interpolated
     across the full width, then smoothed. That reconstructs the lighting field of the real
     photograph without carrying any of V-Ammonium Phosphate's own printing.
  3. Its SHADOW is kept exactly as photographed, untouched.

Then the Crop Force front artwork, trimmed at its own crop marks, is wrapped onto that form with a
cylindrical mapping (a flat sheet around a pouch compresses towards both edges — the inverse-sine
map below) and multiplied by the recovered light.

The result is VAN's own bag under VAN's own studio light, wearing VAN's own artwork. Nothing is
invented and no other company's imagery is involved.

INPUTS, both from F:\\VAN Master Folder 2026\\VAN Master brand work:
  Current Final_Output/P-Phosphorous/V-Ammounum-Phosphate-10kg.png       (form and light)
  01 Products/Crop Force 12 12 18/.../CropForce 10Kg FRONT preview.jpg   (the artwork)
"""
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import gaussian_filter, gaussian_filter1d

B = '/mnt/user-data/uploads/VAN Master brand work/'
TEMPLATE = B + 'Current Final_Output/P-Phosphorous/V-Ammounum-Phosphate-10kg.png'
ART = B + '01 Products/Crop Force 12 12 18/Working Files/05_Presentation/CropForce 10Kg FRONT preview.jpg'
TRIM = (29, 29, 2279, 3176)          # measured from the artwork's own crop marks
WORK_H = 1400
OUT = '/root/van/demo/tools/cropforce-packshot.png'

# ── 1. the form ────────────────────────────────────────────────────────────────────────────────
# The 10 kg V-Ammonium Phosphate pouch is TALLER AND NARROWER than the 10 kg Crop Force pouch:
# VAP's silhouette is 0.54 wide-to-tall, while Crop Force's own print artwork trims to 2250 x 3147,
# which is 0.715. Borrowing VAP's form unchanged would have squeezed Crop Force into a bag it is not.
# So the template is stretched horizontally until its FACE matches the artwork's true proportions.
# Stretching a photograph sideways keeps every fold and highlight where it belongs relative to the
# form; it is the aspect that changes, and the aspect is the thing we know from Crop Force's own
# print file rather than from VAP's.
ART_ASPECT = (TRIM[2] - TRIM[0]) / (TRIM[3] - TRIM[1])
t = Image.open(TEMPLATE).convert('RGBA')
t = t.crop(t.split()[3].getbbox())
t = t.resize((round(t.width * WORK_H / t.height), WORK_H), Image.LANCZOS)
_a = np.asarray(t)[..., 3] > 128
_w = np.array([r.sum() for r in _a]); _ys = np.nonzero(_w > 0)[0]
_body = float(np.median(_w[_ys[len(_ys)//4: len(_ys)*3//4]]))
_k = (ART_ASPECT * WORK_H / 0.976) / _body
t = t.resize((max(1, round(t.width * _k)), WORK_H), Image.LANCZOS)
print(f'template widened x{_k:.3f} so the printed face matches Crop Force\'s own {ART_ASPECT:.3f} aspect')
T = np.asarray(t).astype(np.float32) / 255.0
H, W = T.shape[:2]
alpha = T[..., 3]
rgb = T[..., :3]

mx = rgb.max(axis=2); mn = rgb.min(axis=2)
val = mx
sat = np.where(mx > 1e-6, (mx - mn) / np.maximum(mx, 1e-6), 0)

# The whole silhouette is bag. Measured: this template carries no separate shadow region — its alpha
# width stays between 326 and 372 all the way down, so there is no wide thin band at the base. Using
# the full alpha matters: an earlier version treated only the BRIGHT parts as bag, so V-Ammonium
# Phosphate's own dark green field photograph showed through the Crop Force orange. Another company's
# artwork on your bag would be bad; your own other product's artwork on it is worse.
bag = alpha > 0.5

# ── 2. the light, recovered from the unprinted white of the real photograph ─────────────────────
neutral = bag & (sat < 0.16) & (val > 0.45)
light = np.full((H, W), np.nan, np.float32)
for y in range(H):
    xs = np.nonzero(neutral[y])[0]
    if len(xs) < 25:
        continue
    v = gaussian_filter1d(val[y, xs].astype(np.float32), 3, mode='nearest')
    inside = np.nonzero(bag[y])[0]
    if len(inside) < 10:
        continue
    light[y, inside[0]:inside[-1] + 1] = np.interp(np.arange(inside[0], inside[-1] + 1), xs, v)

for x in range(W):
    col = light[:, x]
    good = np.nonzero(~np.isnan(col))[0]
    if len(good) > 4:
        light[:, x] = np.interp(np.arange(H), good, col[good])
light = np.nan_to_num(light, nan=float(np.nanmedian(light)))
light = gaussian_filter(light, (9, 9))
light /= np.percentile(light[bag], 97)
light = np.clip(light, 0.34, 1.08)

# ── 3. the artwork, trimmed at its own crop marks ───────────────────────────────────────────────
art = Image.open(ART).convert('RGB').crop(TRIM)

widths = np.array([(bag[y]).sum() for y in range(H)])
ys = np.nonzero(widths > 0)[0]
y0, y1 = ys.min(), ys.max()
# The FACE is the body of the bag, not the widest point. The top seal ears flare wider than the
# body; sizing the artwork to that flare pushed the left and right of the label outside the body
# silhouette, which is why "CROP FORCE" and "NPK 12-12-18" came back with their first letters gone.
body = int(np.median(widths[ys[len(ys) // 4: len(ys) * 3 // 4]]))
inset = int(body * 0.012)                       # a sliver of side gusset stays visible, as on a real bag
fw = body - 2 * inset
fh = y1 - y0 + 1
cx = int(np.median([(np.nonzero(bag[y])[0].mean()) for y in ys]))
x0 = cx - fw // 2
art = art.resize((fw, fh), Image.LANCZOS)
A = np.asarray(art).astype(np.float32) / 255.0

# ── 4. wrap it round the pouch: a flat sheet compresses towards both edges ──────────────────────
u = np.clip((np.arange(fw) - (fw - 1) / 2) / ((fw - 1) / 2), -1, 1)
src = (np.arcsin(u * 0.94) / np.arcsin(0.94) + 1) / 2 * (fw - 1)
xi = np.clip(src, 0, fw - 1)
lo = np.floor(xi).astype(int); hi = np.minimum(lo + 1, fw - 1); f = (xi - lo)[None, :, None]
A = A[:, lo] * (1 - f) + A[:, hi] * f

# ── 5. composite ───────────────────────────────────────────────────────────────────────────────
# Anywhere the silhouette is wider than the face — the seal ears — takes the artwork's own top-edge
# colour rather than a guess, so the flare reads as more of the same material.
edge = A[:12].reshape(-1, 3).mean(axis=0)
face = np.tile(edge, (H, W, 1)).astype(np.float32)
face[y0:y0 + fh, x0:x0 + fw] = A
out = np.where(bag[..., None], np.clip(face * light[..., None], 0, 1), rgb)

# ── 6. a contact shadow, since this template carries none ──────────────────────────────────────
# The canvas grows at the foot first: the bag ran to the last pixel row, so a shadow had nowhere to
# fall and the pack read as cut off by the frame rather than standing on a surface.
PAD = int(H * 0.075)
out = np.pad(out, ((0, PAD), (0, 0), (0, 0)))
alpha = np.pad(alpha, ((0, PAD), (0, 0)))
bag = np.pad(bag, ((0, PAD), (0, 0)))
H = H + PAD

sh = gaussian_filter(bag.astype(np.float32), (9, 26))
sh = np.roll(sh, int(PAD * 0.55), axis=0) * 0.5
sh[: y1 - int(H * 0.02)] = 0
a_out = np.clip(alpha + sh * (1 - alpha), 0, 1)
out = np.where((alpha < 0.5)[..., None], np.zeros_like(out), out)

res = Image.fromarray((np.dstack([out, a_out]) * 255).astype(np.uint8), 'RGBA')
res.save(OUT)
print(f'wrote {OUT}  {res.size}')
print(f'body {body}px, face {fw}x{fh}')
