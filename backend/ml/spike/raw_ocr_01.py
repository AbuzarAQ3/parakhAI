r"""
Spike RAW OCR 01 : Running PaddleOCR on the image and printing the text it is returing.
To Use: from the root type backend\ml\.venv01 
"""
import os
import sys
import time
from pathlib import Path
from paddleocr import PaddleOCR

os.environ["PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK"] = "True"

def main() -> None:
    if len(sys.argv) != 2:
        print("Usage : Python raw_ocr_01.py <image path>")
        sys.exit(1)

    image_path = Path(sys.argv[1])
    if not image_path.is_file() :
        print(f"Image not Found : {image_path}")
        sys.exit(1)

    output_dir = Path(__file__).resolve().parents[1] / "output"

    start = time.perf_counter()
    ocr = PaddleOCR(
        use_doc_orientation_classify = False,
        use_doc_unwarping = False,
        use_textline_orientation = False,
        enable_mkldnn = False,
    )
    load_seconds = time.perf_counter() - start
    results = ocr.predict(str(image_path))
    predict_time = time.perf_counter() - start

    for res in results:
        data = res.json.get("res", res.json)
        texts = data["rec_texts"]
        scores = data["rec_scores"]
        boxes = data["rec_boxes"]
        print(f"Found {len(texts)} text lines in {image_path.name}")
        for i, (text, score, box) in enumerate(zip(texts, scores, boxes)):
            box_ints = [int(v) for v in box]
            print(f"{i:02d} conf={float(score):.2f} box = {box_ints} test = {text!r}")
            res.save_to_img(str(output_dir))

    print(f"\n Model load : {load_seconds:.1f}s | Recognition : {predict_time:.1f}s")
    print(f"annotated image saved in : {output_dir}")


if __name__ == "__main__":
    main()