from pathlib import Path

import torch
import timm
from PIL import Image
from torchvision import transforms


# --------------------------------------------------
# Paths
# --------------------------------------------------

# backend/model.py
#       ↓
# backend/
#       ↓
# PASHU/
PROJECT_ROOT = Path(__file__).resolve().parent.parent

MODEL_PATH = PROJECT_ROOT / "models" / "best_model.pth"


# --------------------------------------------------
# Device
# --------------------------------------------------

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# --------------------------------------------------
# Image preprocessing
# --------------------------------------------------

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# --------------------------------------------------
# Load model once
# --------------------------------------------------

def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found at: {MODEL_PATH}"
        )

    checkpoint = torch.load(
        MODEL_PATH,
        map_location=DEVICE,
        weights_only=False
    )

    classes = checkpoint["classes"]
    idx_to_breed = checkpoint["idx_to_breed"]

    model = timm.create_model(
        "efficientnet_b0",
        pretrained=False,
        num_classes=len(classes)
    )

    model.load_state_dict(checkpoint["model_state_dict"])

    model = model.to(DEVICE)
    model.eval()

    return model, idx_to_breed


model, idx_to_breed = load_model()


# --------------------------------------------------
# Prediction
# --------------------------------------------------

def predict_image(image: Image.Image):
    image = image.convert("RGB")

    image_tensor = transform(image)
    image_tensor = image_tensor.unsqueeze(0)
    image_tensor = image_tensor.to(DEVICE)

    with torch.no_grad():
        outputs = model(image_tensor)

    probabilities = torch.softmax(outputs, dim=1)

    top_probabilities, top_indices = torch.topk(
        probabilities,
        k=3,
        dim=1
    )

    top_probabilities = top_probabilities[0]
    top_indices = top_indices[0]

    predictions = []

    for probability, index in zip(
        top_probabilities,
        top_indices
    ):
        index = index.item()

        # Handle both possible checkpoint formats
        if isinstance(idx_to_breed, dict):
            breed = idx_to_breed[index]
            if breed is None:
                breed = idx_to_breed[str(index)]
        else:
            breed = idx_to_breed[index]

        predictions.append({
            "breed": breed,
            "confidence": round(probability.item(), 4)
        })

    return predictions