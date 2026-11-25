'''
    I am crating as parallel processing and checking its erfficicency, usijg the gest confugs from past tests
'''

import sys
import time
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
from paddleocr import PaddleOCR

CONFIG = dict(
        use_doc_orientation_classify = False,
        use_doc_unwarping = False,
        use_textline_orientation = False,
        enable_mkldnn = False,
        text_detection_model_name = "PP-OCRv5_mobile_det", 
        text_recognition_model_name = "PP-OCRv5_mobile_rec",
        text_det_limit_type = "max",
        text_det_limit_side_len = 960
)

def process_image(image_path):
    
    ocr = PaddleOCR(**CONFIG)
    start = time.perf_counter()
    res = list(ocr.predict(image_path))
    elapsed = time.perf_counter() - start

    data = res[0].json.get("res", res[0].json)
    lines = len(data["rec_texts"])
    return image_path, elapsed, lines

def main():
    samples_dir = Path(__file__).resolve().parents[1] / "samples"
    image_paths = [str(p) for p in samples_dir.glob("*.jpg")] # as for now i am only testing on jpg

    if not image_paths:
        print("No image Found !")
        sys.exit(1)

    print(f"Found {len(image_paths)} images for parallel processing")
    total_start = time.perf_counter()

    with ProcessPoolExecutor() as executor:
        results = list(executor.map(process_image, image_paths))

    total_elapsed = time.perf_counter() - total_start
    print("\n ---- Results ----")
    for path, elapsed, lines in results:
        print(f"{Path(path).name}: {elapsed:.2f}s ({lines} lines)")

    print(f"Total time for batch: {total_elapsed:.2f}s")
    print(f"Average time per image: {total_elapsed / len(image_paths):.2f}s")
    print(f"Throughput: {(len(image_paths) / total_elapsed) * 60:.1f} images/minutes")

if __name__ == "__main__":
    main()