from pathlib import Path

import torch
import timm
from PIL import Image
from torchvision import transforms


class BovineClassifier:

    def __init__(self, model_path: Path):

        self.model_path = Path(model_path)

        # ==================================================
        # DEVICE
        # ==================================================

        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        print(f"[PASHU] Using device: {self.device}")

        if torch.cuda.is_available():
            print(
                f"[PASHU] GPU: "
                f"{torch.cuda.get_device_name(0)}"
            )

        # ==================================================
        # CPU OPTIMIZATION
        # ==================================================

        if self.device.type == "cpu":
            torch.set_num_threads(1)
            print("[PASHU] CPU threads limited to 1")

        # ==================================================
        # LOAD EFFICIENTNET MODEL
        # ==================================================

        print("[PASHU] Loading breed model...")

        checkpoint = torch.load(
            self.model_path,
            map_location=self.device,
            weights_only=False
        )

        self.classes = checkpoint["classes"]
        self.breed_to_idx = checkpoint["breed_to_idx"]
        self.idx_to_breed = checkpoint["idx_to_breed"]

        self.model = timm.create_model(
            "efficientnet_b0",
            pretrained=False,
            num_classes=len(self.classes)
        )

        self.model.load_state_dict(
            checkpoint["model_state_dict"]
        )

        self.model.to(self.device)
        self.model.eval()

        # ==================================================
        # IMAGE TRANSFORM
        # ==================================================

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

        print("[PASHU] Breed model loaded successfully.")
        print(f"[PASHU] Breed classes: {len(self.classes)}")
        print("[PASHU] Backend ready!")

    # ======================================================
    # BREED PREDICTION
    # ======================================================

    def predict_breed(self, image: Image.Image):

        image = image.convert("RGB")

        image_tensor = self.transform(image)

        image_tensor = image_tensor.unsqueeze(0)

        image_tensor = image_tensor.to(self.device)

        # ==================================================
        # MODEL INFERENCE
        # ==================================================

        with torch.inference_mode():

            outputs = self.model(
                image_tensor
            )

        # ==================================================
        # PROBABILITIES
        # ==================================================

        probabilities = torch.softmax(
            outputs,
            dim=1
        )

        # ==================================================
        # TOP 3 PREDICTIONS
        # ==================================================

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

            if index in self.idx_to_breed:

                breed = self.idx_to_breed[index]

            else:

                breed = self.idx_to_breed[str(index)]

            results.append({
                "breed": str(breed),
                "confidence": float(
                    probability.item()
                )
            })

        return results

    # ======================================================
    # MAIN PREDICTION
    # ======================================================

    def predict(self, image: Image.Image):

        image = image.convert("RGB")

        # ==================================================
        # BREED CLASSIFICATION
        # ==================================================

        predictions = self.predict_breed(
            image
        )

        # ==================================================
        # NO PREDICTION
        # ==================================================

        if not predictions:

            return {
                "is_bovine": False,
                "detected_type": None,
                "detector_confidence": 0.0,
                "predictions": []
            }

        # ==================================================
        # COW / BUFFALO BREEDS
        # ==================================================

        buffalo_breeds = {
            "Banni",
            "Jaffrabadi",
            "Mehsana",
            "Murrah",
            "Nagpuri",
            "Nili_Ravi",
            "Surti"
        }

        # ==================================================
        # BEST BREED
        # ==================================================

        best_breed = predictions[0]["breed"]

        if best_breed in buffalo_breeds:

            detected_type = "buffalo"

        else:

            detected_type = "cow"

        # ==================================================
        # RETURN RESULT
        # ==================================================

        return {
            "is_bovine": True,
            "detected_type": detected_type,
            "detector_confidence": 1.0,
            "predictions": predictions
        }