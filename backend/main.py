from pathlib import Path
from io import BytesIO

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from backend.inference import BovineClassifier


# ==========================================================
# PROJECT PATH
# ==========================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

MODEL_PATH = PROJECT_ROOT / "models" / "best_model.pth"


# ==========================================================
# FASTAPI
# ==========================================================

app = FastAPI(
    title="PASHU API",
    description="Indian Bovine Breed Identification API",
    version="1.1.0"
)


# ==========================================================
# CORS
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://pashu-hwhi.onrender.com",
],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ==========================================================
# LOAD MODEL
# ==========================================================

print("[PASHU] Loading model...")

classifier = BovineClassifier(
    MODEL_PATH
)

print("[PASHU] Backend ready!")


# ==========================================================
# HEALTH CHECK
# ==========================================================

@app.get("/api/health")
def health():

    return {
        "status": "ok",
        "service": "PASHU AI",
        "model": "EfficientNet-B0"
    }


# ==========================================================
# PREDICT
# ==========================================================

@app.post("/api/predict")
async def predict(
    image: UploadFile = File(...)
):

    try:

        # --------------------------------------------------
        # READ IMAGE
        # --------------------------------------------------

        contents = await image.read()

        pil_image = Image.open(
            BytesIO(contents)
        )

        pil_image = pil_image.convert("RGB")

    except (
        UnidentifiedImageError,
        OSError,
        ValueError
    ):

        return {
            "success": False,
            "error": "Invalid image"
        }

    try:

        # --------------------------------------------------
        # RUN PREDICTION
        # --------------------------------------------------

        result = classifier.predict(
            pil_image
        )

        # --------------------------------------------------
        # NON-BOVINE
        # --------------------------------------------------

        if not result["is_bovine"]:

            return {
                "success": True,
                "is_bovine": False,
                "message": (
                    "No cow or buffalo detected. "
                    "Please upload a clear image "
                    "containing a cow or buffalo."
                ),
                "prediction": None
            }

        # --------------------------------------------------
        # BOVINE
        # --------------------------------------------------

        predictions = result["predictions"]

        best_prediction = predictions[0]

        return {
            "success": True,
            "is_bovine": True,
            "detected_type": result["detected_type"],
            "detector_confidence": result[
                "detector_confidence"
            ],
            "prediction": {
                "breed": best_prediction["breed"],
                "confidence": best_prediction["confidence"],
                "top_predictions": predictions
            }
        }

    except Exception as error:

        print(
            "[PASHU] Prediction error:",
            error
        )

        return {
            "success": False,
            "error": "Prediction failed"
        }