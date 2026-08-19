from pathlib import Path

import torch
import timm
from PIL import Image
from torchvision import transforms
from ultralytics import YOLO


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

        # ==================================================
        # LOAD YOLO
        # ==================================================

        print("[PASHU] Loading bovine detector...")

        PROJECT_ROOT = Path(__file__).resolve().parent.parent

        self.detector = YOLO(
            PROJECT_ROOT / "yolo11n.pt"
        )

        print("[PASHU] Models loaded successfully.")
    # ======================================================
    # BOVINE DETECTION
    # ======================================================

    def detect_bovine(self, image: Image.Image):

        results = self.detector.predict(
            source=image,
            verbose=False,
            conf=0.25
        )

        detections = []

        for result in results:

            if result.boxes is None:
                continue

            for box in result.boxes:

                class_id = int(box.cls.item())
                confidence = float(box.conf.item())

                class_name = result.names[class_id]

                detections.append({
                    "class": class_name,
                    "confidence": confidence
                })

        # Find cow detection
        cow_detections = [
            detection
            for detection in detections
            if detection["class"].lower() == "cow"
        ]

        if cow_detections:

            best_cow = max(
                cow_detections,
                key=lambda x: x["confidence"]
            )

            return {
                "is_bovine": True,
                "detected_type": "cow",
                "detector_confidence": best_cow[
                    "confidence"
                ],
                "detections": detections
            }

        # No cow detected
        return {
            "is_bovine": False,
            "detected_type": None,
            "detector_confidence": 0.0,
            "detections": detections
        }

    # ======================================================
    # BREED PREDICTION
    # ======================================================

    def predict_breed(self, image: Image.Image):

        image = image.convert("RGB")

        image_tensor = self.transform(image)

        image_tensor = image_tensor.unsqueeze(0)

        image_tensor = image_tensor.to(self.device)

        with torch.no_grad():

            outputs = self.model(
                image_tensor
            )

        probabilities = torch.softmax(
            outputs,
            dim=1
        )

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

        # --------------------------------------------------
        # STEP 1: CHECK FOR BOVINE
        # --------------------------------------------------

        bovine_check = self.detect_bovine(
            image
        )

        # --------------------------------------------------
        # NON-BOVINE IMAGE
        # --------------------------------------------------

        if not bovine_check["is_bovine"]:

            return {
                "is_bovine": False,
                "detected_type": None,
                "detector_confidence": 0.0,
                "predictions": []
            }

        # --------------------------------------------------
        # STEP 2: BREED CLASSIFICATION
        # --------------------------------------------------

        predictions = self.predict_breed(
            image
        )

        # --------------------------------------------------
        # STEP 3: DETERMINE COW / BUFFALO
        # --------------------------------------------------

        buffalo_breeds = {
            "Banni",
            "Jaffrabadi",
            "Mehsana",
            "Murrah",
            "Nagpuri",
            "Nili_Ravi",
            "Surti"
        }

        best_breed = predictions[0]["breed"]

        if best_breed in buffalo_breeds:

            detected_type = "buffalo"

        else:

            detected_type = "cow"

        # --------------------------------------------------
        # RETURN
        # --------------------------------------------------

        return {
            "is_bovine": True,
            "detected_type": detected_type,
            "detector_confidence": bovine_check[
                "detector_confidence"
            ],
            "predictions": predictions
        }