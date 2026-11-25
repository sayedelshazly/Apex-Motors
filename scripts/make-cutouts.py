#!/usr/bin/env python3
"""Generate transparent-background cutouts for all cars in public/cars.

Pipeline: rembg (isnet-general-use) -> alpha hardening -> keep largest
connected component (drops background ghosts) -> light feather -> crop
-> WebP with alpha. Run with the rembg venv python.
"""
import glob
import os
import sys

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

from rembg import new_session, remove

SRC = os.path.join(os.path.dirname(__file__), '..', 'public', 'cars')
OUT = os.path.join(SRC, 'cut')
os.makedirs(OUT, exist_ok=True)


def harden(a: np.ndarray) -> np.ndarray:
    lut = np.zeros(256, dtype=np.uint8)
    for v in range(256):
        if v < 60:
            lut[v] = 0
        elif v > 200:
            lut[v] = 255
        else:
            lut[v] = round((v - 60) / (200 - 60) * 255)
    return lut[a]


def largest_component(a: np.ndarray) -> np.ndarray:
    mask = a > 10
    labels, n = ndimage.label(mask)
    if n <= 1:
        return a
    sizes = ndimage.sum(mask, labels, index=range(1, n + 1))
    keep = 1 + int(np.argmax(sizes))
    out = np.where(labels == keep, a, 0).astype(np.uint8)
    return out


def main():
    session = new_session('isnet-general-use')
    files = sorted(glob.glob(os.path.join(SRC, '*.jpg')))
    for path in files:
        name = os.path.splitext(os.path.basename(path))[0]
        dest = os.path.join(OUT, name + '.webp')
        im = Image.open(path).convert('RGB')
        cut = remove(im, session=session)
        a = harden(np.array(cut.getchannel('A')))
        a = largest_component(a)
        alpha = Image.fromarray(a).filter(ImageFilter.GaussianBlur(0.6))
        cut.putalpha(alpha)
        bbox = cut.getbbox()
        if bbox:
            pad = 6
            bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad),
                    min(cut.width, bbox[2] + pad), min(cut.height, bbox[3] + pad))
            cut = cut.crop(bbox)
        if cut.width > 1400:
            cut = cut.resize((1400, round(cut.height * 1400 / cut.width)), Image.LANCZOS)
        cut.save(dest, 'WEBP', quality=90, method=6)
        print(f'{name}: {cut.size} {os.path.getsize(dest)//1024}KB', flush=True)
    print('ALL DONE')


if __name__ == '__main__':
    sys.exit(main())
