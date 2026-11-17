r"""
Spike 1b : checking the reason for time inefficiency.
To Use: from the root type backend\ml\spike\speed_check_01b.py backend\ml\samples\pack1.jpg 
"""

import os
import sys
import time

from PIL import Image, ImageOps
from paddleocr import PaddleOCR
from pathlib import Path

COMMON = dict(
        use_doc_orientation_classify = False,
        use_doc_unwarping = False,
        use_textline_orientation = False,
        enable_mkldnn = False
    )

MOBILE = dict(
    text_detection_model_name = "PP-OCRv5_mobile_det", 
    text_recognition_model_name = "PP-OCRv5_mobile_rec" 
)

CASES = [
    ("A defaults models, 2000px", {}, 2000),
    ("B mobile models, 2000px", MOBILE , 2000),
    ("C mobile models, 1280px", MOBILE, 2000),
    ("D mobile + detect max 960, 2000px", {**MOBILE, "text_det_limit_type" : "max", "text_det_limit_side_len" : 960}, 2000)
    ]

def make_copy(src: Path, long_edge: int, out_dir: Path) -> Path:
    "Fixing the phone rotation (EXIF), shrinking so the long edge is long_edge and saving to out_dir"
    img = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    if max(img.size) > long_edge:
        scale = long_edge / max(img.size)
        img = img.resize((round(img.width * scale), (img.height * scale)), Image.LANCZOS)
    out = out_dir / f"{src.stem}_{long_edge}.jpg"
    img.save(out, quality = 92)
    return out


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage : Python raw_ocr_01.py <image path>")
        sys.exit(1)
    src = Path(sys.argv[1])
    image_path = Path(sys.argv[1])
    output_dir = Path(__file__).resolve().parents[1] / "output"
    output_dir.mkdir(exist_ok = True)
    
    with Image.open(src) as img:
        print(f" Original Image : {img.size[0]}x{img.size[1]} px, {src.stat().st_size / 1e6:.1f} MB /n ")

    for name, extra, long_edges in CASES:
        small = make_copy(src, long_edges, output_dir)
        ocr = PaddleOCR(**COMMON, **extra)
        times, lines = [], 0
        for _ in range(2):
            start = time.perf_counter()
            res = list(ocr.predict(str(small)))
            times.append(time.perf_counter() - start)
            data = res[0].json.get("res", res[0].json)
            lines = len(data["rec_texts"])
            has_mrp = any("mrp" in t.lower() for t in data["rec_texts"])
        print(f"{name} : run1 = {times[0]:.2f}s, run2 = {times[1]:.2f}s mrp-word_seen = {has_mrp}")


if __name__ == "__main__":
    main()