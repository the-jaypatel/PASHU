import os
import sys

from PIL import Image

import torch
from torchvision import transforms

import timm


# ==========================================================
# CONFIGURATION
# ==========================================================

MODEL_PATH = "models/best_model.pth"

IMAGE_SIZE = 224
TOP_K = 3

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# ==========================================================
# HEADER
# ==========================================================

print("=" * 50)
print("PASHU AI")
print("INDIAN BOVINE BREED IDENTIFICATION")
print("=" * 50)


# ==========================================================
# CHECK IMAGE ARGUMENT
# ==========================================================

if len(sys.argv) != 2:
    print("\nUsage:")
    print('python src/predict.py "path\\to\\image.jpg"')
    sys.exit(1)


IMAGE_PATH = sys.argv[1]


# ==========================================================
# CHECK FILES
# ==========================================================

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model not found: {MODEL_PATH}"
    )

if not os.path.isfile(IMAGE_PATH):
    raise FileNotFoundError(
        f"Image not found: {IMAGE_PATH}"
    )


# ==========================================================
# LOAD CHECKPOINT
# ==========================================================

print(f"\nDevice: {DEVICE}")

if torch.cuda.is_available():
    print(
        f"GPU: {torch.cuda.get_device_name(0)}"
    )

print("\nLoading trained model...")

checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE,
    weights_only=False
)

classes = checkpoint["classes"]

idx_to_breed = checkpoint["idx_to_breed"]

NUM_CLASSES = len(classes)

print(
    f"Number of breeds: {NUM_CLASSES}"
)


# ==========================================================
# CREATE MODEL
# ==========================================================

model = timm.create_model(
    "efficientnet_b0",
    pretrained=False,
    num_classes=NUM_CLASSES
)

model.load_state_dict(
    checkpoint["model_state_dict"]
)

model = model.to(DEVICE)

model.eval()

print("Model loaded successfully.")


# ==========================================================
# IMAGE TRANSFORM
# ==========================================================

transform = transforms.Compose([

    transforms.Resize(
        (IMAGE_SIZE, IMAGE_SIZE)
    ),

    transforms.ToTensor(),

    transforms.Normalize(

        mean=[
            0.485,
            0.456,
            0.406
        ],

        std=[
            0.229,
            0.224,
            0.225
        ]
    )
])


# ==========================================================
# LOAD IMAGE
# ==========================================================

print("\nLoading image...")

try:

    image = Image.open(
        IMAGE_PATH
    ).convert("RGB")

except Exception as e:

    raise ValueError(
        f"Invalid image: {e}"
    )


image_tensor = transform(
    image
)

image_tensor = image_tensor.unsqueeze(
    0
)

image_tensor = image_tensor.to(
    DEVICE
)


# ==========================================================
# RUN INFERENCE
# ==========================================================

print("Running inference...")

with torch.no_grad():

    outputs = model(
        image_tensor
    )

    probabilities = torch.softmax(
        outputs,
        dim=1
    )

    top_probabilities, top_indices = torch.topk(
        probabilities,
        k=TOP_K,
        dim=1
    )


# ==========================================================
# GET RESULTS
# ==========================================================

top_probabilities = (
    top_probabilities[0]
    .cpu()
    .numpy()
)

top_indices = (
    top_indices[0]
    .cpu()
    .numpy()
)


predicted_index = int(
    top_indices[0]
)

predicted_breed = idx_to_breed[
    predicted_index
]

predicted_confidence = float(
    top_probabilities[0]
)


# ==========================================================
# DISPLAY RESULT
# ==========================================================

print("\n")
print("=" * 50)

print(
    f"Image:\n{os.path.basename(IMAGE_PATH)}"
)

print("\nPrediction:")

print(
    predicted_breed
)

print("\nConfidence:")

print(
    f"{predicted_confidence * 100:.2f}%"
)


# ==========================================================
# TOP 3 PREDICTIONS
# ==========================================================

print("\nTop 3 Predictions:")
print()

for rank, (index, probability) in enumerate(
    zip(top_indices, top_probabilities),
    start=1
):

    breed = idx_to_breed[
        int(index)
    ]

    confidence = (
        float(probability) * 100
    )

    print(
        f"{rank}. "
        f"{breed:<20} "
        f"{confidence:.2f}%"
    )


# ==========================================================
# LOW CONFIDENCE WARNING
# ==========================================================

LOW_CONFIDENCE_THRESHOLD = 0.50

if predicted_confidence < LOW_CONFIDENCE_THRESHOLD:

    print("\n")
    print("Warning:")
    print(
        "Prediction confidence is low."
    )

    print(
        "Try uploading a clearer image "
        "showing the animal's face and body."
    )


# ==========================================================
# COMPLETE
# ==========================================================

print("\n")
print("=" * 50)
print("PREDICTION COMPLETE")
print("=" * 50)
