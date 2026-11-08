"""Derive web-sized assets from the supplied portfolio; never modify originals."""
from pathlib import Path
from io import BytesIO
from shutil import copy2
from PIL import Image, ImageOps
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parents[1] / 'public'
MEDIA = OUT / 'media'
MEDIA.mkdir(parents=True, exist_ok=True)
pdf = PdfReader(ROOT / 'Portfolio.pdf')

def save(image, name, alpha=False):
    image = ImageOps.exif_transpose(image)
    for width in (640, 1280):
        variant = image.copy()
        variant.thumbnail((width, width * 2))
        variant.save(MEDIA / f'{name}-{width}.webp', 'WEBP', quality=88, method=6)

def extract(page, index, name):
    save(Image.open(BytesIO(pdf.pages[page - 1].images[index].data)).convert('RGB'), name)

save(Image.open(ROOT / 'WueHans/Promo/Promomaterial/Bilder/_DSC5607_Cutout.png'), 'console', True)
for args in [(6,0,'tony-title'), (7,0,'tony'), (8,1,'tony-movement'),
             (10,0,'mitzi'), (10,1,'mitzi-world'), (14,0,'crocodile'),
             (18,1,'ant'), (20,0,'phoebus'), (21,1,'cityplan'),
             (24,2,'architecture'), (25,1,'gpu'), (25,0,'apu'),
             (26,0,'tennis'), (26,1,'tower'), (26,2,'gatherer'), (26,3,'cow')]:
    extract(*args)
copy2(ROOT / 'Portfolio.pdf', OUT / 'Yannik-Stamm-Portfolio.pdf')
print('Prepared', len(list(MEDIA.glob('*.webp'))), 'responsive images and portfolio PDF.')
