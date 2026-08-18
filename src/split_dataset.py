from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split


DATASET_DIR = Path(
    "archive/Indian_bovine_breeds/Indian_bovine_breeds"
)


# ==========================================
# LOAD DATASET
# ==========================================

records = []

image_extensions = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp"
}


for breed_dir in sorted(DATASET_DIR.iterdir()):

    if not breed_dir.is_dir():
        continue

    for image_path in breed_dir.iterdir():

        if image_path.suffix.lower() in image_extensions:

            records.append({
                "image_path": str(image_path),
                "breed": breed_dir.name
            })


df = pd.DataFrame(records)


print("Total images:", len(df))
print("Total breeds:", df["breed"].nunique())


# ==========================================
# TRAIN / VALIDATION / TEST
# ==========================================

train_df, temp_df = train_test_split(
    df,
    test_size=0.30,
    stratify=df["breed"],
    random_state=42
)


val_df, test_df = train_test_split(
    temp_df,
    test_size=0.50,
    stratify=temp_df["breed"],
    random_state=42
)


# ==========================================
# RESULTS
# ==========================================

print("\nDataset split")
print("-----------------------------")

print("Training   :", len(train_df))
print("Validation :", len(val_df))
print("Testing    :", len(test_df))


print("\nBreeds in each split")

print(
    "Train      :",
    train_df["breed"].nunique()
)

print(
    "Validation :",
    val_df["breed"].nunique()
)

print(
    "Test       :",
    test_df["breed"].nunique()
)


# ==========================================
# SAVE SPLITS
# ==========================================

Path("archive/splits").mkdir(
    parents=True,
    exist_ok=True
)

train_df.to_csv(
    "archive/splits/train.csv",
    index=False
)

val_df.to_csv(
    "archive/splits/validation.csv",
    index=False
)

test_df.to_csv(
    "archive/splits/test.csv",
    index=False
)


print("\nSplit files saved:")
print("archive/splits/train.csv")
print("archive/splits/validation.csv")
print("archive/splits/test.csv")