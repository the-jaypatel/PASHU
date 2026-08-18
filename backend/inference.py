from pathlib import Path

import torch
import timm
from PIL import Image
from torchvision import transforms


class BovineClassifier:

    def __init__(self, model_path: Path):

        self.model_path = Path(model_path)

        # Automatically use NVIDIA CUDA if available.
        # Otherwise use CPU.
        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        print(f"[PASHU] Using device: {self.device}")

        # Load checkpoint
        checkpoint = torch.load(
            self.model_path,
            map_location=self.device,
            weights_only=False
        )

        # Get class information from checkpoint
        self.classes = checkpoint["classes"]
        self.breed_to_idx = checkpoint["breed_to_idx"]
        self.idx_to_breed = checkpoint["idx_to_breed"]

        # Create EfficientNet-B0
        self.model = timm.create_model(
            "efficientnet_b0",
            pretrained=False,
            num_classes=len(self.classes)
        )

        # Load trained model weights
        self.model.load_state_dict(
            checkpoint["model_state_dict"]
        )

        # Move model to CPU/GPU
        self.model.to(self.device)

        # Evaluation mode
        self.model.eval()

        # Same preprocessing used by your trained model
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

        print("[PASHU] Model loaded successfully.")
        print(f"[PASHU] Classes: {len(self.classes)}")

    def predict(self, image: Image.Image):

        # Convert image to RGB
        image = image.convert("RGB")

        # Apply preprocessing
        image_tensor = self.transform(image)

        # Add batch dimension
        image_tensor = image_tensor.unsqueeze(0)

        # Move image to CPU/GPU
        image_tensor = image_tensor.to(self.device)

        # Run model
        with torch.no_grad():
            outputs = self.model(image_tensor)

        # Convert output to probabilities
        probabilities = torch.softmax(outputs, dim=1)

        # Get top 3
        top_probabilities, top_indices = torch.topk(
            probabilities,
            k=3,
            dim=1
        )

        results = []

        for probability, index in zip(
            top_probabilities[0],
            top_indices[0]
        ):

            index = int(index.item())

            # Handle integer/string checkpoint keys
            if index in self.idx_to_breed:
                breed = self.idx_to_breed[index]
            else:
                breed = self.idx_to_breed[str(index)]

            results.append({
                "breed": str(breed),
                "confidence": float(probability.item())
            })

        return results