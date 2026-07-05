"""Comprime las fotos del sitio a WebP (peso web). Conserva los .jpg (para OG)."""
import os, glob
from PIL import Image, ImageOps

IMG = os.path.join(os.path.dirname(__file__), "img")
MAX = 1600      # lado más largo
Q = 72          # calidad WebP

total_before = total_after = 0
for jpg in sorted(glob.glob(os.path.join(IMG, "*.jpg"))):
    before = os.path.getsize(jpg)
    im = Image.open(jpg)
    im = ImageOps.exif_transpose(im).convert("RGB")
    w, h = im.size
    if max(w, h) > MAX:
        s = MAX / max(w, h)
        im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
    out = jpg[:-4] + ".webp"
    im.save(out, "WEBP", quality=Q, method=6)
    after = os.path.getsize(out)
    total_before += before; total_after += after
    print(f"  {os.path.basename(jpg):14} {before//1024:4}kb -> {after//1024:4}kb webp")

print(f"\nTotal: {total_before//1024}kb -> {total_after//1024}kb  ({100-round(total_after/total_before*100)}% menos)")
