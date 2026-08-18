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
# CHECK ARGUMENT
# ==========================================================

if len(sys.argv) != 2:
    print("\nUsage:")
    print(
        'python src\\batch_predict.py '
        '"path\\to\\breed_folder"'
    )
    sys.exit(1)


FOLDER_PATH = sys.argv[1]


if not os.path.isdir(FOLDER_PATH):
    raise FileNotFoundError(
        f"Folder not found: {FOLDER_PATH}"
    )


if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model not found: {MODEL_PATH}"
    )


# ==========================================================
# HEADER
# ==========================================================

print("=" * 70)
print("PASHU AI - BATCH BREED TEST")
print("=" * 70)

print(f"\nDevice: {DEVICE}")

if torch.cuda.is_available():
    print(
        f"GPU: {torch.cuda.get_device_name(0)}"
    )


# ==========================================================
# LOAD MODEL
# ==========================================================

print("\nLoading trained model...")

checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE,
    weights_only=False
)

classes = checkpoint["classes"]
idx_to_breed = checkpoint["idx_to_breed"]

NUM_CLASSES = len(classes)

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

print(
    f"Number of breeds: {NUM_CLASSES}"
)


# ==========================================================
# TRANSFORM
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
# FIND IMAGES
# ==========================================================

valid_extensions = (
    ".jpg",
    ".jpeg",
    ".png",
    ".JPG",
    ".JPEG",
    ".PNG"
)

image_files = [
    f
    for f in os.listdir(FOLDER_PATH)
    if f.endswith(valid_extensions)
]

image_files.sort()

if len(image_files) == 0:
    print("\nNo images found.")
    sys.exit(1)


# ==========================================================
# EXPECTED BREED
# ==========================================================

expected_breed = os.path.basename(
    os.path.normpath(FOLDER_PATH)
)

print(
    f"\nExpected Breed: {expected_breed}"
)

print(
    f"Images Found: {len(image_files)}"
)

print("\nRunning predictions...")
print("-" * 70)


# ==========================================================
# RESULTS
# ==========================================================

correct = 0
total = 0

results = []


# ==========================================================
# PREDICTION
# ==========================================================

for image_file in image_files:

    image_path = os.path.join(
        FOLDER_PATH,
        image_file
    )

    try:

        image = Image.open(
            image_path
        ).convert("RGB")

        image_tensor = transform(
            image
        )

        image_tensor = image_tensor.unsqueeze(
            0
        ).to(DEVICE)

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

        predicted_index = int(
            top_indices[0][0].item()
        )

        predicted_breed = idx_to_breed[
            predicted_index
        ]

        confidence = float(
            top_probabilities[0][0].item()
        )

        is_correct = (
            predicted_breed == expected_breed
        )

        if is_correct:
            correct += 1

        total += 1

        results.append(
            (
                image_file,
                predicted_breed,
                confidence,
                is_correct
            )
        )

        status = "✓" if is_correct else "✗"

        print(
            f"{image_file:<30}"
            f"{predicted_breed:<20}"
            f"{confidence * 100:>6.2f}% "
            f"{status}"
        )

    except Exception as e:

        print(
            f"{image_file:<30}"
            f"ERROR: {e}"
        )


# ==========================================================
# SUMMARY
# ==========================================================

print("\n")
print("=" * 70)
print("BATCH TEST RESULTS")
print("=" * 70)

accuracy = (
    correct / total
    if total > 0
    else 0
)

print(
    f"\nBreed              : {expected_breed}"
)

print(
    f"Images Tested      : {total}"
)

print(
    f"Correct Predictions: {correct}"
)

print(
    f"Wrong Predictions  : {total - correct}"
)

print(
    f"Accuracy           : {accuracy * 100:.2f}%"
)


# ==========================================================
# MOST COMMON WRONG PREDICTIONS
# ==========================================================

wrong_predictions = {}

for (
    image_file,
    predicted_breed,
    confidence,
    is_correct
) in results:

    if not is_correct:

        wrong_predictions[
            predicted_breed
        ] = (
            wrong_predictions.get(
                predicted_breed,
                0
            ) + 1
        )


if wrong_predictions:

    print("\nMost Common Wrong Predictions:")

    sorted_wrong = sorted(
        wrong_predictions.items(),
        key=lambda x: x[1],
        reverse=True
    )

    for breed, count in sorted_wrong:

        print(
            f"  {breed:<25}"
            f"{count} images"
        )


print("\n")
print("=" * 70)
print("BATCH TEST COMPLETE")
print("=" * 70)