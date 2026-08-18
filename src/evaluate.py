import os
import numpy as np
import pandas as pd

from PIL import Image

import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms

import timm

from sklearn.metrics import (
    accuracy_score,
    f1_score,
    classification_report,
    confusion_matrix
)

import matplotlib.pyplot as plt


# ==========================================================
# CONFIGURATION
# ==========================================================

TEST_CSV = "archive/splits/test.csv"
MODEL_PATH = "models/best_model.pth"

IMAGE_SIZE = 224
BATCH_SIZE = 32
NUM_WORKERS = 0

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# ==========================================================
# HEADER
# ==========================================================

print("=" * 60)
print("PASHU AI - MODEL EVALUATION")
print("=" * 60)

print(f"\nDevice: {DEVICE}")

if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")


# ==========================================================
# CHECK FILES
# ==========================================================

if not os.path.exists(TEST_CSV):
    raise FileNotFoundError(
        f"Test CSV not found: {TEST_CSV}"
    )

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model not found: {MODEL_PATH}"
    )


# ==========================================================
# LOAD TEST DATA
# ==========================================================

print("\nLoading test dataset...")

test_df = pd.read_csv(TEST_CSV)

print(f"Test images: {len(test_df)}")


# ==========================================================
# LOAD MODEL CHECKPOINT
# ==========================================================

print("\nLoading trained model...")

checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE,
    weights_only=False
)

classes = checkpoint["classes"]

breed_to_idx = checkpoint["breed_to_idx"]

idx_to_breed = checkpoint["idx_to_breed"]

NUM_CLASSES = len(classes)

print(f"Number of breeds: {NUM_CLASSES}")

print("Model checkpoint loaded successfully.")


# ==========================================================
# TRANSFORM
# ==========================================================

test_transform = transforms.Compose([

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
# DATASET
# ==========================================================

class BovineTestDataset(Dataset):

    def __init__(
        self,
        dataframe,
        transform
    ):

        self.df = dataframe.reset_index(
            drop=True
        )

        self.transform = transform


    def __len__(self):

        return len(self.df)


    def __getitem__(self, idx):

        row = self.df.iloc[idx]

        image_path = row["image_path"]

        image = Image.open(
            image_path
        ).convert("RGB")

        image = self.transform(
            image
        )

        label = breed_to_idx[
            row["breed"]
        ]

        return image, label


# ==========================================================
# CREATE DATASET
# ==========================================================

print("\nCreating test dataloader...")

test_dataset = BovineTestDataset(
    test_df,
    test_transform
)

test_loader = DataLoader(

    test_dataset,

    batch_size=BATCH_SIZE,

    shuffle=False,

    num_workers=NUM_WORKERS,

    pin_memory=torch.cuda.is_available()

)

print(
    f"Test batches: {len(test_loader)}"
)


# ==========================================================
# CREATE MODEL
# ==========================================================

print("\nCreating EfficientNet-B0...")

model = timm.create_model(

    "efficientnet_b0",

    pretrained=False,

    num_classes=NUM_CLASSES

)


# ==========================================================
# LOAD TRAINED WEIGHTS
# ==========================================================

model.load_state_dict(
    checkpoint["model_state_dict"]
)

model = model.to(DEVICE)

model.eval()

print("Model ready.")


# ==========================================================
# RUN PREDICTIONS
# ==========================================================

print("\nRunning inference...")
print("-" * 60)

predictions = []
targets = []

correct = 0
total = 0


with torch.no_grad():

    for batch_index, (images, labels) in enumerate(
        test_loader
    ):

        images = images.to(
            DEVICE,
            non_blocking=True
        )

        labels = labels.to(
            DEVICE,
            non_blocking=True
        )

        outputs = model(
            images
        )

        preds = outputs.argmax(
            dim=1
        )

        predictions.extend(
            preds.cpu().numpy()
        )

        targets.extend(
            labels.cpu().numpy()
        )

        correct += (
            preds == labels
        ).sum().item()

        total += labels.size(0)

        print(
            f"Processed batch "
            f"{batch_index + 1}/"
            f"{len(test_loader)}",
            end="\r"
        )


print("\n\nInference complete.")


# ==========================================================
# CALCULATE METRICS
# ==========================================================

accuracy = accuracy_score(
    targets,
    predictions
)

macro_f1 = f1_score(

    targets,

    predictions,

    average="macro",

    zero_division=0

)

weighted_f1 = f1_score(

    targets,

    predictions,

    average="weighted",

    zero_division=0

)


# ==========================================================
# FINAL RESULTS
# ==========================================================

print("\n")
print("=" * 60)
print("FINAL TEST RESULTS")
print("=" * 60)

print(
    f"\nTest Accuracy : "
    f"{accuracy * 100:.2f}%"
)

print(
    f"Macro F1      : "
    f"{macro_f1:.4f}"
)

print(
    f"Weighted F1   : "
    f"{weighted_f1:.4f}"
)


# ==========================================================
# CLASSIFICATION REPORT
# ==========================================================

print("\n")
print("=" * 60)
print("CLASSIFICATION REPORT")
print("=" * 60)

report = classification_report(

    targets,

    predictions,

    target_names=classes,

    zero_division=0

)

print(report)


# ==========================================================
# CREATE REPORT DIRECTORY
# ==========================================================

os.makedirs(
    "report",
    exist_ok=True
)


# ==========================================================
# SAVE TEXT REPORT
# ==========================================================

report_path = (
    "report/classification_report.txt"
)

with open(
    report_path,
    "w",
    encoding="utf-8"
) as f:

    f.write(
        "PASHU AI - TEST RESULTS\n"
    )

    f.write(
        "=" * 60 + "\n\n"
    )

    f.write(
        f"Test Images: "
        f"{len(test_df)}\n"
    )

    f.write(
        f"Test Accuracy: "
        f"{accuracy * 100:.2f}%\n"
    )

    f.write(
        f"Macro F1: "
        f"{macro_f1:.4f}\n"
    )

    f.write(
        f"Weighted F1: "
        f"{weighted_f1:.4f}\n\n"
    )

    f.write(
        report
    )


print(
    f"Report saved: {report_path}"
)


# ==========================================================
# CONFUSION MATRIX
# ==========================================================

print("\nCreating confusion matrix...")

cm = confusion_matrix(

    targets,

    predictions

)


plt.figure(
    figsize=(18, 16)
)

plt.imshow(
    cm,
    interpolation="nearest"
)

plt.title(
    "PASHU - 41 Breed Confusion Matrix"
)

plt.xlabel(
    "Predicted Breed"
)

plt.ylabel(
    "Actual Breed"
)

plt.xticks(

    range(NUM_CLASSES),

    classes,

    rotation=90,

    fontsize=7

)

plt.yticks(

    range(NUM_CLASSES),

    classes,

    fontsize=7

)

plt.colorbar()

plt.tight_layout()

confusion_path = (
    "report/confusion_matrix.png"
)

plt.savefig(

    confusion_path,

    dpi=200

)

plt.close()


print(
    f"Confusion matrix saved: "
    f"{confusion_path}"
)


# ==========================================================
# COMPLETE
# ==========================================================

print("\n")
print("=" * 60)
print("EVALUATION COMPLETE")
print("=" * 60)

print(
    "\nThe model has now been evaluated "
    "on the untouched 890-image test set."
)