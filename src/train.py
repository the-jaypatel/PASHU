import os
import numpy as np
import pandas as pd

from PIL import Image

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms

import timm

from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import f1_score

from tqdm import tqdm


# ==========================================================
# PASHU - BOVINE BREED CLASSIFICATION
# EfficientNet-B0 | 41 Breeds
# ==========================================================


# ==========================================================
# CONFIGURATION
# ==========================================================

TRAIN_CSV = "archive/splits/train.csv"
VAL_CSV = "archive/splits/validation.csv"

MODEL_DIR = "models"

IMAGE_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 10
LEARNING_RATE = 1e-4

NUM_WORKERS = 0

os.makedirs(MODEL_DIR, exist_ok=True)


# ==========================================================
# DEVICE
# ==========================================================

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("=" * 60)
print("PASHU AI - TRAINING")
print("=" * 60)

print(f"\nDevice: {DEVICE}")

if torch.cuda.is_available():

    print(
        f"GPU: {torch.cuda.get_device_name(0)}"
    )

    gpu_memory = (
        torch.cuda.get_device_properties(0).total_memory
        / (1024 ** 3)
    )

    print(
        f"GPU Memory: {gpu_memory:.2f} GB"
    )


# ==========================================================
# LOAD DATA
# ==========================================================

print("\nLoading dataset...")

train_df = pd.read_csv(TRAIN_CSV)
val_df = pd.read_csv(VAL_CSV)

print(f"Training images: {len(train_df)}")
print(f"Validation images: {len(val_df)}")


# ==========================================================
# CLASS MAPPING
# ==========================================================

classes = sorted(
    train_df["breed"].unique()
)

breed_to_idx = {
    breed: idx
    for idx, breed in enumerate(classes)
}

idx_to_breed = {
    idx: breed
    for breed, idx in breed_to_idx.items()
}

NUM_CLASSES = len(classes)

print(f"Number of breeds: {NUM_CLASSES}")


# ==========================================================
# IMAGE TRANSFORMS
# ==========================================================

train_transform = transforms.Compose([

    transforms.Resize(
        (IMAGE_SIZE, IMAGE_SIZE)
    ),

    transforms.RandomHorizontalFlip(
        p=0.5
    ),

    transforms.RandomRotation(
        10
    ),

    transforms.ColorJitter(
        brightness=0.2,
        contrast=0.2,
        saturation=0.2
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


val_transform = transforms.Compose([

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
# DATASET CLASS
# ==========================================================

class BovineDataset(Dataset):

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

        breed = row["breed"]

        try:

            image = Image.open(
                image_path
            ).convert("RGB")

        except Exception as e:

            print(
                f"\nError loading image: "
                f"{image_path}"
            )

            raise e


        image = self.transform(
            image
        )

        label = breed_to_idx[
            breed
        ]

        return image, label


# ==========================================================
# CREATE DATASETS
# ==========================================================

print("\nCreating datasets...")

train_dataset = BovineDataset(
    train_df,
    train_transform
)

val_dataset = BovineDataset(
    val_df,
    val_transform
)


# ==========================================================
# DATA LOADERS
# ==========================================================

print("Creating dataloaders...")

train_loader = DataLoader(

    train_dataset,

    batch_size=BATCH_SIZE,

    shuffle=True,

    num_workers=NUM_WORKERS,

    pin_memory=True,

    persistent_workers=(
        NUM_WORKERS > 0
    )
)


val_loader = DataLoader(

    val_dataset,

    batch_size=BATCH_SIZE,

    shuffle=False,

    num_workers=NUM_WORKERS,

    pin_memory=True,

    persistent_workers=(
        NUM_WORKERS > 0
    )
)


print(
    f"Training batches: "
    f"{len(train_loader)}"
)

print(
    f"Validation batches: "
    f"{len(val_loader)}"
)


# ==========================================================
# MODEL
# ==========================================================

print("\nLoading EfficientNet-B0...")

model = timm.create_model(

    "efficientnet_b0",

    pretrained=True,

    num_classes=NUM_CLASSES
)

model = model.to(DEVICE)


print("Model loaded successfully.")


# ==========================================================
# CLASS WEIGHTS
# ==========================================================

print("\nCalculating class weights...")

class_names = np.array(
    classes
)

weights = compute_class_weight(

    class_weight="balanced",

    classes=class_names,

    y=train_df[
        "breed"
    ].to_numpy()
)

weights = torch.tensor(

    weights,

    dtype=torch.float32

).to(DEVICE)


criterion = nn.CrossEntropyLoss(

    weight=weights

)


# ==========================================================
# OPTIMIZER
# ==========================================================

optimizer = torch.optim.AdamW(

    model.parameters(),

    lr=LEARNING_RATE,

    weight_decay=1e-4
)


# ==========================================================
# MIXED PRECISION
# ==========================================================

use_amp = torch.cuda.is_available()

if use_amp:

    scaler = torch.amp.GradScaler(
        "cuda"
    )

    print(
        "\nMixed Precision: ENABLED"
    )

else:

    scaler = None

    print(
        "\nMixed Precision: DISABLED"
    )


# ==========================================================
# TRAINING
# ==========================================================

best_f1 = 0.0

best_epoch = 0


print("\n")
print("=" * 60)
print("STARTING TRAINING")
print("=" * 60)


for epoch in range(EPOCHS):


    # ======================================================
    # TRAIN
    # ======================================================

    model.train()

    running_loss = 0.0

    correct = 0

    total = 0


    progress_bar = tqdm(

        train_loader,

        desc=f"Epoch {epoch + 1}/{EPOCHS}"

    )


    for images, labels in progress_bar:


        images = images.to(

            DEVICE,

            non_blocking=True

        )

        labels = labels.to(

            DEVICE,

            non_blocking=True

        )


        optimizer.zero_grad(
            set_to_none=True
        )


        if use_amp:

            with torch.autocast(

                device_type="cuda",

                dtype=torch.float16

            ):

                outputs = model(
                    images
                )

                loss = criterion(
                    outputs,
                    labels
                )


            scaler.scale(
                loss
            ).backward()


            scaler.step(
                optimizer
            )


            scaler.update()


        else:

            outputs = model(
                images
            )

            loss = criterion(
                outputs,
                labels
            )

            loss.backward()

            optimizer.step()


        running_loss += (
            loss.item()
        )


        predictions = outputs.argmax(
            dim=1
        )


        correct += (
            predictions == labels
        ).sum().item()


        total += labels.size(0)


        progress_bar.set_postfix(

            loss=f"{loss.item():.4f}"

        )


    # ======================================================
    # TRAIN METRICS
    # ======================================================

    train_loss = (
        running_loss
        / len(train_loader)
    )

    train_accuracy = (
        correct / total
    )


    # ======================================================
    # VALIDATION
    # ======================================================

    model.eval()

    val_predictions = []

    val_targets = []

    val_loss_total = 0.0


    with torch.no_grad():

        for images, labels in val_loader:


            images = images.to(

                DEVICE,

                non_blocking=True

            )

            labels = labels.to(

                DEVICE,

                non_blocking=True

            )


            if use_amp:

                with torch.autocast(

                    device_type="cuda",

                    dtype=torch.float16

                ):

                    outputs = model(
                        images
                    )

                    loss = criterion(
                        outputs,
                        labels
                    )

            else:

                outputs = model(
                    images
                )

                loss = criterion(
                    outputs,
                    labels
                )


            val_loss_total += (
                loss.item()
            )


            predictions = outputs.argmax(
                dim=1
            )


            val_predictions.extend(

                predictions
                .cpu()
                .numpy()

            )


            val_targets.extend(

                labels
                .cpu()
                .numpy()

            )


    # ======================================================
    # VALIDATION METRICS
    # ======================================================

    val_loss = (

        val_loss_total
        / len(val_loader)

    )


    val_f1 = f1_score(

        val_targets,

        val_predictions,

        average="macro"

    )


    val_accuracy = (

        np.array(val_predictions)
        == np.array(val_targets)

    ).mean()


    # ======================================================
    # PRINT RESULTS
    # ======================================================

    print("\n")
    print("-" * 60)

    print(
        f"Epoch {epoch + 1}/{EPOCHS}"
    )

    print(
        f"Train Loss     : "
        f"{train_loss:.4f}"
    )

    print(
        f"Train Accuracy : "
        f"{train_accuracy * 100:.2f}%"
    )

    print(
        f"Val Loss       : "
        f"{val_loss:.4f}"
    )

    print(
        f"Val Accuracy   : "
        f"{val_accuracy * 100:.2f}%"
    )

    print(
        f"Val Macro F1   : "
        f"{val_f1:.4f}"
    )


    # ======================================================
    # SAVE BEST MODEL
    # ======================================================

    if val_f1 > best_f1:

        best_f1 = val_f1

        best_epoch = (
            epoch + 1
        )


        checkpoint = {

            "model_state_dict":
                model.state_dict(),

            "classes":
                classes,

            "breed_to_idx":
                breed_to_idx,

            "idx_to_breed":
                idx_to_breed,

            "epoch":
                epoch + 1,

            "val_accuracy":
                val_accuracy,

            "val_f1":
                val_f1,

        }


        model_path = os.path.join(

            MODEL_DIR,

            "best_model.pth"

        )


        torch.save(

            checkpoint,

            model_path

        )


        print(
            f"\n✓ BEST MODEL SAVED"
        )

        print(
            f"Path: {model_path}"
        )

        print(
            f"Best F1: {best_f1:.4f}"
        )


    print("-" * 60)


# ==========================================================
# TRAINING COMPLETE
# ==========================================================

print("\n")
print("=" * 60)
print("TRAINING COMPLETE")
print("=" * 60)

print(
    f"\nBest Epoch: {best_epoch}"
)

print(
    f"Best Validation Macro F1: "
    f"{best_f1:.4f}"
)

print(
    "\nModel saved at:"
)

print(
    os.path.abspath(
        os.path.join(
            MODEL_DIR,
            "best_model.pth"
        )
    )
)

print("\nPASHU baseline training finished.")