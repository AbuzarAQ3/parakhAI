{
    "contract-version" : "0.1",
    "pipeline-version" : "dev",
    "image" : {
        "widht" : 3024,
        "height" : 4032,
        "sha256" : "...",
        "role" : "unknown",
    },
    "image_quality" : {
        "status" : "ok", 
        "metrics : {
            "sharpness" : 0,
            "glare_fractions" : 0
        },
        "reasons" : []
    },
    "regions" : [
        {
            "id" : "r1",
            "box" : {"x" : 0.52, "y" : 0.61, "w" : 0.18, "h" : 0.04},
            "label" : "mrp",
            "ocr-text" : "MRP Rs.100",
            "ocr-confidence" : 0.98,
            "metrices" : {
                "sharpness" : 0,
                "contrast" : 0,
                "tesxt_height_px" : 0,
                "glare_fractions" : 0
            },
            "status" : "ok",
            "reasons" : []
        }
    ],
    "fields" : [
        {
            "key" : "mrp",
            "status" : "ok ",
            "value" : "28",
            "raw-text" : "MRP Rs.100",
            "region_id" : "r1",
            "reasons" ; []
        },
        {
            "key" : "batch_number",
            "status" : "not_found",
            "value" : null,
            "raw_text" : null,
            "reasons" : ["NOT_FOUND_IN_IMAGE"]
        }
    ],
    "readability" : { "ok" : 1, "needs_review" : 0, "not_found" : 4 },
    "timings_ms" : {"quality" : 0, "detect" : 0, "recognise" : 0, extract : 0, "total" : 0},
    "warnings" : []
}