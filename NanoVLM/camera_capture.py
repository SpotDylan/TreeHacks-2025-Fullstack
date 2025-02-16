#!/usr/bin/env python3
import cv2
import os
import time

def capture_image():
    # Initialize camera
    cap = cv2.VideoCapture(0)
    
    # Take a picture
    ret, frame = cap.read()
    
    # Release camera
    cap.release()
    
    if ret:
        # Create directory if it doesn't exist
        os.makedirs('captured_images', exist_ok=True)
        
        # Save the image with timestamp
        filename = f'captured_images/capture_{int(time.time()*1000)}.jpg'
        cv2.imwrite(filename, frame)
        print(f"Image saved as {filename}")
    else:
        print("Failed to capture image")

if __name__ == "__main__":
    capture_image() 