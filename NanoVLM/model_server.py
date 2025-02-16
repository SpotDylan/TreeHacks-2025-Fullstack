#!/usr/bin/env python3
from flask import Flask, request, jsonify
import PIL.Image
import os
import io
import json
import subprocess
import logging
import threading
import time
from functools import lru_cache
from camera_capture import capture_image
import nano_llm.chat as chat
import nano_llm.nano_llm as nano_llm

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Initialize configuration
MODEL = "Efficient-Large-Model/VILA1.5-3b"
MODEL_PATH = "/data/models/huggingface/Efficient-Large-Model/VILA1.5-3b"

# Model configuration
MODEL_CONFIG = {
    "model_type": "vila",
    "vision_config": {
        "image_size": 224,
        "vision_model_type": "clip"
    },
    "max_position_embeddings": 256
}

# Load medical prompt from file
with open(os.path.join(os.path.dirname(__file__), 'medical_prompt.txt'), 'r') as f:
    BASE_PROMPT = f.read().strip()

# Create upload directory
upload_dir = os.path.join(os.path.dirname(__file__), 'captured_images')
os.makedirs(upload_dir, exist_ok=True)
logger.info(f"Upload directory: {upload_dir}")

# Global model instance and lock
model = None
model_lock = threading.Lock()

def initialize_model():
    """Initialize the model if not already initialized"""
    global model
    if model is None:
        with model_lock:
            if model is None:  # Double-check pattern
                logger.info("Loading model...")
                try:
                    model = nano_llm.NanoLLM(
                        model_path=MODEL_PATH,
                        api="mlc",
                        max_context_len=256,
                        max_new_tokens=64,
                        config=MODEL_CONFIG,  # Pass the config directly
                        use_cuda=True
                    )
                    logger.info("Model loaded successfully")
                except Exception as e:
                    logger.error(f"Failed to load model: {str(e)}")
                    raise

# Initialize model at startup
initialize_model()

@lru_cache(maxsize=32)
def get_cached_result(image_path, timestamp):
    """Cache wrapper to prevent duplicate processing within 5 minutes"""
    current_time = time.time()
    if current_time - timestamp > 300:  # 5 minute cache
        get_cached_result.cache_clear()
    return None

def process_image_with_model(image_path, timeout=30):
    """Process an image using the loaded model with timeout"""
    logger.info(f"Processing image: {image_path}")
    
    # Check cache first
    cache_key = (image_path, int(time.time() / 300))  # 5-minute buckets
    cached = get_cached_result(*cache_key)
    if cached:
        logger.info("Returning cached result")
        return cached
    
    # Ensure model is initialized
    initialize_model()
    
    # Use lock to prevent concurrent model runs
    if not model_lock.acquire(timeout=1.0):
        logger.warning("Model is busy processing another image")
        raise Exception("Model is busy processing another image")
    
    try:
        # Process the image
        start_time = time.time()
        
        # Create chat history and add prompts
        history = chat.ChatHistory(model)
        history.append_system(BASE_PROMPT)
        history.append_user_image(image_path)
        
        # Generate response
        response = history.generate()
        
        logger.info(f"Model inference time: {time.time() - start_time:.2f} seconds")
        return response.strip()
            
    finally:
        model_lock.release()

@app.route('/health')
def health_check():
    """Endpoint to check if the server is running"""
    return jsonify({
        "status": "healthy",
        "model": MODEL,
        "model_loaded": model is not None,
        "processing": model_lock.locked()
    })

@app.route('/analyze', methods=['POST'])
def analyze_wound():
    """Endpoint to analyze wound images"""
    logger.info("Analyze endpoint called")
    logger.debug(f"Content-Type: {request.content_type}")
    logger.debug(f"Files: {request.files}")
    logger.debug(f"Form: {request.form}")
    logger.debug(f"JSON: {request.get_json(silent=True)}")
    
    try:
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            if 'image' not in request.files:
                logger.error("No image file in multipart form data")
                return jsonify({"error": "No image file provided"}), 400
                
            image_file = request.files['image']
            if image_file.filename == '':
                logger.error("Empty filename in multipart form data")
                return jsonify({"error": "No selected file"}), 400
                
            # Save the uploaded file
            image_path = os.path.join(upload_dir, image_file.filename)
            logger.info(f"Saving uploaded file to: {image_path}")
            image_file.save(image_path)
            
        elif request.content_type == 'application/json':
            if 'image_data' not in request.json:
                logger.error("No image_data in JSON request")
                return jsonify({"error": "No image data provided"}), 400
                
            # Handle base64 encoded image
            import base64
            logger.info("Processing base64 encoded image")
            image_data = base64.b64decode(request.json['image_data'])
            image = PIL.Image.open(io.BytesIO(image_data))
            image_path = os.path.join(upload_dir, 'temp_image.jpg')
            image.save(image_path)
        else:
            logger.error(f"Unsupported Content-Type: {request.content_type}")
            return jsonify({"error": f"Unsupported Content-Type: {request.content_type}"}), 415

        start_time = time.time()
        
        # Process the image using the model
        try:
            result = process_image_with_model(image_path)
        except Exception as model_error:
            logger.error(f"Model error: {str(model_error)}")
            if "Model is busy" in str(model_error):
                return jsonify({
                    "success": False,
                    "error": "Model is busy processing another image"
                }), 503  # Service Unavailable
            raise
        
        # Clean up temporary file if it was created from base64
        if request.content_type == 'application/json' and os.path.exists(image_path):
            logger.info(f"Removing temporary file: {image_path}")
            os.remove(image_path)
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        return jsonify({
            "success": True,
            "response": result,
            "processing_time": process_time
        })
    
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/analyze/path', methods=['POST'])
def analyze_wound_path():
    """Endpoint to analyze wound images from a path"""
    if 'image_path' not in request.json:
        return jsonify({"error": "No image path provided"}), 400
    
    try:
        start_time = time.time()
        image_path = request.json['image_path']
        full_path = os.path.abspath(image_path)
        
        if not os.path.exists(full_path):
            return jsonify({"error": f"Image not found: {image_path}"}), 404
            
        # Process the image using the model
        result = process_image_with_model(full_path)
        
        return jsonify({
            "success": True,
            "response": result,
            "processing_time": time.time() - start_time
        })
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/capture', methods=['POST'])
def capture_endpoint():
    """Endpoint to capture an image from the camera"""
    logger.info("Capture endpoint called")
    
    try:
        # Use the existing upload directory
        capture_image()
        
        # Get the most recent file in the upload directory
        files = [f for f in os.listdir(upload_dir) if f.endswith('.jpg')]
        if not files:
            return jsonify({"error": "No image was captured"}), 500
            
        latest_file = max(files, key=lambda x: os.path.getctime(os.path.join(upload_dir, x)))
        
        return jsonify({
            "success": True,
            "image_path": latest_file
        })
        
    except Exception as e:
        logger.error(f"Error capturing image: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8050) 