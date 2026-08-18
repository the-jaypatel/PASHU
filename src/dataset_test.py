from pathlib import Path
from collections import Counter
from PIL import Image


# ==========================================
# CONFIGURATION
# ==========================================

DATASET_DIR = Path(
    "archive/Indian_bovine_breeds/Indian_bovine_breeds"
)


# ==========================================
# CHECK DATASET
# ==========================================

if not DATASET_DIR.exists():
    print("❌ Dataset directory not found!")
    print("Expected:")
    print(DATASET_DIR.resolve())
    exit()


print("=" * 60)
print("PASHU - INDIAN BOVINE DATASET TEST")
print("=" * 60)

print(f"\nDataset location:")
print(DATASET_DIR.resolve())


# ==========================================
# FIND BREEDS
# ==========================================

breed_dirs = sorted([
    folder
    for folder in DATASET_DIR.iterdir()
    if folder.is_dir()
])


print(f"\nNumber of breeds: {len(breed_dirs)}")


# ==========================================
# COUNT IMAGES
# ==========================================

image_extensions = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp"
}

breed_counts = {}

total_images = 0

for breed_dir in breed_dirs:

    images = [
        file
        for file in breed_dir.iterdir()
        if file.is_file()
        and file.suffix.lower() in image_extensions
    ]

    count = len(images)

    breed_counts[breed_dir.name] = count

    total_images += count


# ==========================================
# PRINT RESULTS
# ==========================================

print(f"Total images: {total_images}")

print("\nImages per breed:")
print("-" * 60)

for breed, count in breed_counts.items():
    print(f"{breed:25} : {count}")


# ==========================================
# STATISTICS
# ==========================================

counts = list(breed_counts.values())

if counts:

    print("\n" + "=" * 60)
    print("DATASET STATISTICS")
    print("=" * 60)

    print(f"Minimum images/breed : {min(counts)}")
    print(f"Maximum images/breed : {max(counts)}")
    print(
        f"Average images/breed : {sum(counts) / len(counts):.2f}"
    )


# ==========================================
# CHECK CORRUPTED IMAGES
# ==========================================

print("\n" + "=" * 60)
print("CHECKING IMAGE FILES")
print("=" * 60)

corrupted = []

for breed_dir in breed_dirs:

    for image_path in breed_dir.iterdir():

        if image_path.suffix.lower() not in image_extensions:
            continue

        try:
            with Image.open(image_path) as img:
                img.verify()

        except Exception:
            corrupted.append(image_path)


print(f"\nCorrupted images: {len(corrupted)}")

if corrupted:

    print("\nExamples:")

    for path in corrupted[:10]:
        print(path)


print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)