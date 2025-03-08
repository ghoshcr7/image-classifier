import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

class ImageClassifier:
    def __init__(self):
        # Load pre-trained MobileNetV2 model
        self.model = tf.keras.applications.MobileNetV2(
            weights='imagenet',
            include_top=True
        )
        # Get the full ImageNet labels
        self.labels = self.get_imagenet_labels()
    #this is a imagnrt function
    def get_imagenet_labels(self):
        # Use TensorFlow's built-in ImageNet class names
        return tf.keras.applications.mobilenet_v2.decode_predictions(
            np.zeros((1, 1000)), top=1000)[0]

    def preprocess_image(self, image_path):
        try:
            # Normalize path for Windows
            image_path = os.path.normpath(image_path)

            # Check if file exists
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image file not found: {image_path}")

            # Open and preprocess image
            img = Image.open(image_path).convert('RGB')
            img = img.resize((224, 224))
            img_array = tf.keras.preprocessing.image.img_to_array(img)
            img_array = tf.expand_dims(img_array, 0)
            return tf.keras.applications.mobilenet_v2.preprocess_input(img_array)

        except Exception as e:
            print(f"Error preprocessing image: {e}")
            raise

    def predict(self, image_path):
        try:
            # Preprocess the image
            preprocessed_img = self.preprocess_image(image_path)

            # Make prediction
            predictions = self.model.predict(preprocessed_img)

            # Use TensorFlow's built-in function to decode predictions
            decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(
                predictions, top=5)[0]

            results = []
            for _, label, confidence in decoded_predictions:
                results.append({
                    'class': label.replace('_', ' ').title(),
                    'confidence': float(confidence) * 100
                })

            return results

        except Exception as e:
            print(f"Error during prediction: {e}")
            # Return a default message if prediction fails
            return [{'class': 'Error processing image', 'confidence': 0}]