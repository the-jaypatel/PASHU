from pathlib import Path
from io import BytesIO

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from backend.inference import BovineClassifier


# --------------------------------------------------
# PROJECT PATH
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent

MODEL_PATH = PROJECT_ROOT / "models" / "best_model.pth"


# --------------------------------------------------
# FASTAPI
# --------------------------------------------------

app = FastAPI(
    title="PASHU API",
    description="Indian Bovine Breed Identification API",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# --------------------------------------------------
# LOAD MODEL ONCE
# --------------------------------------------------

print("[PASHU] Loading model...")

classifier = BovineClassifier(MODEL_PATH)

print("[PASHU] Backend ready!")


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/api/health")
def health():

    return {
        "status": "ok"
    }


# --------------------------------------------------
# PREDICT
# --------------------------------------------------

@app.post("/api/predict")
async def predict(image: UploadFile = File(...)):

    try:

        # Read uploaded file
        contents = await image.read()

        # Open image
        pil_image = Image.open(
            BytesIO(contents)
        )

        # Convert to RGB
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

        # Run model
        predictions = classifier.predict(
            pil_image
        )

        # Best prediction
        best_prediction = predictions[0]

        return {
            "success": True,
            "prediction": {
                "breed": best_prediction["breed"],
                "confidence": best_prediction["confidence"],
                "top_predictions": predictions
            }
        }

    except Exception as error:

        print("[PASHU] Prediction error:", error)

        return {
            "success": False,
            "error": "Prediction failed"
        }