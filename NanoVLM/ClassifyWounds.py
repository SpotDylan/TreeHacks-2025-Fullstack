#Do not edit, 2:28 AM
import subprocess
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import threading
import queue

# Configuration
MODEL = "Efficient-Large-Model/VILA1.5-3b"
BASE_PROMPT = """
You are given an image of a cartoon wound. Output the following based on how the wound would be classified on a human.

{0, 0}: No wound  
{0, 0}: Minor bruise or scratch  
{50, 2}: Minor cut  
{250, 4}: Moderate bruise or cut  
{500, 6}: Large cut  
{1000, 10}: Non-fatal gunshot or stab wound  
{1200, 12}: Fatal wound
"""

class ContainerManager:
    def __init__(self):
        self.process = None
        self.input_queue = queue.Queue()
        self.running = False

    def start(self):
        print("Starting container...")
        # Start the container in persistent mode
        cmd = (
            "jetson-containers run --runtime nvidia -it "  # Added -it flag back
            "--volume /home/jetson/vila15_test:/workspace/vila15_test "
            "--volume /home/jetson/nanollm_project:/workspace/nanollm_project "
            "--volume /home/jetson/jetson-containers/data:/data "
            "--workdir /workspace/vila15_test "
            "dustynv/nano_llm:r36.2.0 "
            "python3 -m nano_llm.chat --api=mlc "
            f"--model {MODEL} "
            "--max-context-len 256 "
            "--max-new-tokens 64 "
            "--interactive"
        )
        
        print("Running command:", cmd)
        
        self.process = subprocess.Popen(
            cmd,
            shell=True,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
            env={"PYTHONUNBUFFERED": "1"}  # Add this to prevent buffering
        )
        
        # Check if process started successfully
        if self.process.poll() is not None:
            print(f"Error: Container failed to start. Return code: {self.process.returncode}")
            stderr_output = self.process.stderr.read()
            print(f"Error output: {stderr_output}")
            return

        print("Container started successfully")
        self.running = True
        
        # Start worker thread to handle image processing
        self.worker_thread = threading.Thread(target=self._process_queue)
        self.worker_thread.daemon = True
        self.worker_thread.start()

    def _process_queue(self):
        while self.running:
            try:
                image_path = self.input_queue.get(timeout=1)
                if image_path:
                    print(f"\nProcessing image: {image_path}")
                    # Send the image path and prompt to the running container
                    prompt = f"/workspace/vila15_test/captured_images/{image_path.name}\n{BASE_PROMPT}\n"
                    print("Sending prompt to container...")
                    
                    try:
                        self.process.stdin.write(prompt + "\n")  # Add newline
                        self.process.stdin.flush()
                        print("Prompt sent, waiting for response...")
                        
                        # Read the response with timeout
                        response_timeout = 30  # 30 seconds timeout
                        start_time = time.time()
                        
                        while True:
                            if time.time() - start_time > response_timeout:
                                print("Response timeout reached")
                                break
                                
                            if self.process.poll() is not None:
                                print("Container process ended unexpectedly")
                                stderr_output = self.process.stderr.read()
                                print(f"Container stderr: {stderr_output}")
                                self.running = False
                                break
                                
                            line = self.process.stdout.readline().strip()
                            if line:
                                print(f"Got line: {line}")
                                if '</s>' in line and not line.startswith('>>'):
                                    print(f"Final classification: {line.strip()}")
                                    break
                    except IOError as e:
                        print(f"IOError while communicating with container: {e}")
                        stderr_output = self.process.stderr.read()
                        print(f"Container stderr: {stderr_output}")
                        
                        # Restart container on communication error
                        print("Attempting to restart container...")
                        self.stop()
                        time.sleep(2)
                        self.start()
            except queue.Empty:
                continue
            except Exception as e:
                print(f"Error processing image: {e}")
                import traceback
                print(traceback.format_exc())

    def process_image(self, image_path):
        print(f"Queueing image for processing: {image_path}")
        self.input_queue.put(image_path)

    def stop(self):
        print("Stopping container manager...")
        self.running = False
        if self.process:
            print("Terminating container process...")
            self.process.terminate()
            self.process.wait()
            print("Container process terminated")

class ImageHandler(FileSystemEventHandler):
    def __init__(self, container_manager):
        self.container_manager = container_manager

    def on_created(self, event):
        if not event.is_directory and event.src_path.lower().endswith(('.jpg', '.jpeg', '.png')):
            # Wait a moment to ensure the file is fully written
            time.sleep(1)
            image_path = Path(event.src_path).absolute()
            if image_path.exists():
                self.container_manager.process_image(image_path)

def main():
    # Set up the watchdog
    watch_path = Path("./captured_images").absolute()
    watch_path.mkdir(exist_ok=True)
    
    # Start the container manager
    container_manager = ContainerManager()
    container_manager.start()
    
    # Set up the file watcher
    event_handler = ImageHandler(container_manager)
    observer = Observer()
    observer.schedule(event_handler, str(watch_path), recursive=False)
    
    print(f"\nStarting to watch {watch_path} for new images...")
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        container_manager.stop()
        print("\nStopped watching directory")
    
    observer.join()

if __name__ == "__main__":
    main()